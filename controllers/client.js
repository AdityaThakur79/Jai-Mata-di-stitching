import Client from "../models/client.js";
import Branch from "../models/branch.js";
import Employee from "../models/employee.js";
import { v2 as cloudinary } from "cloudinary";

// Create new client
export const createClient = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      address,
      city,
      state,
      pincode,
      
      notes,
      gstin,
    } = req.body;

    // Validation
    if (!name || !email || !mobile || !address || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "Name, email, mobile, address, city, state, and pincode are required.",
      });
    }

    // Helper to normalize Indian mobile to 91XXXXXXXXXX format
    const normalizeIndianMobile = (val) => {
      if (!val) return val;
      const digits = String(val).replace(/\D/g, "");
      const last10 = digits.slice(-10);
      return last10 ? `91${last10}` : undefined;
    };

    // Check if client already exists
    const existingClient = await Client.findOne({ email: email.toLowerCase() });
    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "Client with this email already exists.",
      });
    }

    // Handle profile image upload
    let profileImage = "";
    let profileImagePublicId = "";
    if (req.files && req.files.profileImage) {
      profileImage = req.files.profileImage[0].path;
      profileImagePublicId = req.files.profileImage[0].filename;
    }

    // Get user info from request (set by auth middleware)
    const user = req.employee || req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Get the actual employee _id if we have employeeId
    let registeredById = user._id;
    if (user.employeeId && !user._id) {
      const employee = await Employee.findOne({ employeeId: user.employeeId });
      if (employee) {
        registeredById = employee._id;
      }
    }

    // Handle branch selection - if user doesn't have branchId, they need to select one
    const { branchId } = req.body;
    if (!user.branchId && !branchId) {
      return res.status(400).json({
        success: false,
        message: "Branch selection is required.",
      });
    }

    const newClient = await Client.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: normalizeIndianMobile(mobile),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      profileImage,
      profileImagePublicId,
      notes: notes || "",
      branchId: user.branchId || branchId,
      registeredBy: registeredById,
      gstin: gstin ? gstin.trim().toUpperCase() : undefined,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully.",
      client: newClient,
    });
  } catch (err) {
    console.error("Error creating client:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: err.message,
    });
  }
};

// Get all clients with pagination and search
export const getAllClients = async (req, res) => {
  try {
    let { page, limit, search, city, state, isActive } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = {};
    
    // Branch-based filtering
    const user = req.employee || req.user;
    if (user && user.branchId && !["director", "superAdmin"].includes(user.role)) {
      query.branchId = user.branchId;
    }
    
    // Search functionality
    if (search && search !== "") {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { clientId: { $regex: search, $options: "i" } },
      ];
    }
    
    // Filter by city
    if (city && city !== "") {
      query.city = { $regex: city, $options: "i" };
    }
    
    // Filter by state
    if (state && state !== "") {
      query.state = { $regex: state, $options: "i" };
    }
    
    // Filter by active status
    if (isActive !== undefined && isActive !== "") {
      query.isActive = isActive === "true";
    }

    const clients = await Client.find(query)
      .populate("branchId", "branchName")
      .populate("registeredBy", "name employeeId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Client.countDocuments(query);

    res.status(200).json({
      success: true,
      message: "Clients fetched successfully",
      clients,
      page,
      limit,
      total,
      currentPageCount: clients.length,
      totalPage: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Error fetching clients:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching clients",
      error: err.message,
    });
  }
};

// Get client by ID
export const getClientById = async (req, res) => {
  try {
    const { clientId } = req.body;

    const client = await Client.findById(clientId)
      .populate("branchId", "branchName address")
      .populate("registeredBy", "name employeeId role");

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client fetched successfully",
      client,
    });
  } catch (err) {
    console.error("Error fetching client:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Update client
export const updateClient = async (req, res) => {
  try {
    const {
      clientId,
      name,
      email,
      mobile,
      address,
      city,
      state,
      pincode,
      dateOfBirth,
      gender,
      notes,
      isActive,
      branchId,
      gstin,
    } = req.body;

    const existingClient = await Client.findById(clientId);
    if (!existingClient) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Check if email is being changed and if new email already exists
    if (email && email.toLowerCase() !== existingClient.email) {
      const emailExists = await Client.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: clientId }
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Client with this email already exists.",
        });
      }
    }

    // Handle profile image update
    if (req.files && req.files.profileImage) {
      // Delete old image if exists
      if (existingClient.profileImagePublicId) {
        await cloudinary.uploader.destroy(existingClient.profileImagePublicId);
      }
      existingClient.profileImage = req.files.profileImage[0].path;
      existingClient.profileImagePublicId = req.files.profileImage[0].filename;
    }

    // Update fields
    if (name) existingClient.name = name.trim();
    if (email) existingClient.email = email.toLowerCase().trim();
    if (mobile) existingClient.mobile = mobile.trim();
    if (address) existingClient.address = address.trim();
    if (city) existingClient.city = city.trim();
    if (state) existingClient.state = state.trim();
    if (pincode) existingClient.pincode = pincode.trim();
    
    if (notes !== undefined) existingClient.notes = notes;
    if (isActive !== undefined) existingClient.isActive = isActive;
    if (branchId) {
      existingClient.branchId = branchId;
    }
    if (gstin !== undefined) existingClient.gstin = gstin ? gstin.trim().toUpperCase() : undefined;

    await existingClient.save();

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client: existingClient,
    });
  } catch (err) {
    console.error("Error updating client:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Lookup GSTIN using free sheet.gstin.dev API
export const lookupGstin = async (req, res) => {
  try {
    const { gstin } = req.body;
    if (!gstin) {
      return res.status(400).json({ success: false, message: "GSTIN is required" });
    }
    const gst = String(gstin).toUpperCase().trim();
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;
    if (!gstinRegex.test(gst)) {
      return res.status(400).json({ success: false, message: "Invalid GSTIN format" });
    }
    // Use global fetch (Node 18+). Add a timeout to avoid hanging requests.
    // 1) Prefer AppyFlow when key available (more reliable)
    if (process.env.APPYFLOW_API_KEY) {
      try {
        const afResp = await fetch(`https://appyflow.in/api/verifyGST?gstNo=${gst}&key_secret=${process.env.APPYFLOW_API_KEY}`);
        if (afResp.ok) {
          const af = await afResp.json();
          const afGstin = af?.taxpayerInfo?.gstin || af?.gstin;
          if (afGstin && afGstin.toUpperCase() === gst) {
            const pr = af?.taxpayerInfo?.pradr || {};
            const addr = pr?.adr || {};
            const normalized = {
              gstin: gst,
              legalName: af?.taxpayerInfo?.lgnm || undefined,
              tradeName: af?.taxpayerInfo?.tradeNam || undefined,
              businessName: af?.taxpayerInfo?.tradeNam || af?.taxpayerInfo?.lgnm || undefined,
              gstStatus: af?.taxpayerInfo?.sts || undefined,
              gstStateCode: af?.taxpayerInfo?.stjCd || undefined,
              businessType: af?.taxpayerInfo?.ctb || undefined,
              address: {
                full: (typeof af?.taxpayerInfo?.pradr?.adr === 'string' && af?.taxpayerInfo?.pradr?.adr) || [addr?.bno, addr?.flno, addr?.st, addr?.loc, addr?.dst].filter(Boolean).join(", "),
                city: addr?.dst || "",
                state: addr?.stcd || "",
                pincode: String(addr?.pncd || (typeof af?.taxpayerInfo?.pradr?.adr === 'string' ? (af?.taxpayerInfo?.pradr?.adr.match(/\b\d{6}\b/)||[])[0]||'' : '')),
              },
            };
            return res.status(200).json({ success: true, data: normalized });
          }
        }
      } catch (e) {
        // continue to other fallbacks
      }
    }

    // 2) sheet.gstin.dev and mirrors
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let resp;
    try {
      resp = await fetch(`https://sheet.gstin.dev/1/gstin/${gst}`, { signal: controller.signal });
    } catch (networkErr) {
      clearTimeout(timeout);
      // Try via public proxies/mirrors for sheet.gstin.dev
      const proxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://sheet.gstin.dev/1/gstin/${gst}`)}`,
        `https://thingproxy.freeboard.io/fetch/https://sheet.gstin.dev/1/gstin/${gst}`,
        `https://r.jina.ai/http://sheet.gstin.dev/1/gstin/${gst}`,
      ];
      for (const url of proxyUrls) {
        try {
          const p = await fetch(url);
          if (p.ok) {
            const text = await p.text();
            let json;
            try { json = JSON.parse(text); } catch { json = null; }
            if (json) {
              const normalized = {
                gstin: gst,
                legalName: json?.lgnm || json?.legal_name || undefined,
                tradeName: json?.trade_name || json?.tradeNam || undefined,
                businessName: json?.trade_name || json?.lgnm || undefined,
                gstStatus: json?.gstin_status || json?.sts || undefined,
                gstStateCode: json?.stjcd || json?.state_code || undefined,
                businessType: json?.dty || json?.constitution_of_business || undefined,
                address: (() => {
                  const pr = json?.pradr?.addr || json?.principal_place_of_business || {};
                  const bno = pr?.bno || pr?.building_name || "";
                  const flno = pr?.flno || pr?.floor_number || "";
                  const loc = pr?.loc || pr?.location || "";
                  const st = pr?.st || pr?.street || "";
                  const dst = pr?.dst || pr?.district || "";
                  const pncd = pr?.pncd || pr?.pincode || "";
                  const stcd = pr?.stcd || pr?.state || "";
                  return {
                    full: [bno, flno, st, loc, dst].filter(Boolean).join(", "),
                    city: dst || "",
                    state: stcd || "",
                    pincode: String(pncd || ""),
                  };
                })(),
              };
              return res.status(200).json({ success: true, data: normalized });
            }
          }
        } catch (_) {}
      }
      // If still nothing, proceed to partial
      // Partial fallback: extract PAN and state code from GSTIN so user can proceed manually
      const stateCode = gst.substring(0, 2);
      const panFromGstin = gst.substring(2, 12);
      return res.status(200).json({
        success: true,
        data: {
          gstin: gst,
          pan: panFromGstin,
          gstStateCode: stateCode,
        },
        warning: "GST service unreachable. Returned partial details from GSTIN."
      });
    }
    clearTimeout(timeout);
    if (!resp.ok) {
      // Try proxy/mirror
      const proxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(`https://sheet.gstin.dev/1/gstin/${gst}`)}`,
        `https://thingproxy.freeboard.io/fetch/https://sheet.gstin.dev/1/gstin/${gst}`,
        `https://r.jina.ai/http://sheet.gstin.dev/1/gstin/${gst}`,
      ];
      for (const url of proxyUrls) {
        try {
          const p = await fetch(url);
          if (p.ok) {
            const text = await p.text();
            let json;
            try { json = JSON.parse(text); } catch { json = null; }
            if (json) {
              const normalized = {
                gstin: gst,
                legalName: json?.lgnm || json?.legal_name || undefined,
                tradeName: json?.trade_name || json?.tradeNam || undefined,
                businessName: json?.trade_name || json?.lgnm || undefined,
                gstStatus: json?.gstin_status || json?.sts || undefined,
                gstStateCode: json?.stjcd || json?.state_code || undefined,
                businessType: json?.dty || json?.constitution_of_business || undefined,
                address: (() => {
                  const pr = json?.pradr?.addr || json?.principal_place_of_business || {};
                  const bno = pr?.bno || pr?.building_name || "";
                  const flno = pr?.flno || pr?.floor_number || "";
                  const loc = pr?.loc || pr?.location || "";
                  const st = pr?.st || pr?.street || "";
                  const dst = pr?.dst || pr?.district || "";
                  const pncd = pr?.pncd || pr?.pincode || "";
                  const stcd = pr?.stcd || pr?.state || "";
                  return {
                    full: [bno, flno, st, loc, dst].filter(Boolean).join(", "),
                    city: dst || "",
                    state: stcd || "",
                    pincode: String(pncd || ""),
                  };
                })(),
              };
              return res.status(200).json({ success: true, data: normalized });
            }
          }
        } catch (_) {}
      }
      // AppyFlow was tried first; if mirrors failed, we fall back to partial below
      // If remote responds non-OK, still return partial parse to help the user
      const stateCode = gst.substring(0, 2);
      const panFromGstin = gst.substring(2, 12);
      return res.status(200).json({
        success: true,
        data: {
          gstin: gst,
          pan: panFromGstin,
          gstStateCode: stateCode,
        },
        warning: "Unable to fetch GST details. Returned partial details from GSTIN."
      });
    }
    const data = await resp.json();
    // Normalize from API
    const normalized = {
      gstin: gst,
      legalName: data?.lgnm || data?.legal_name || undefined,
      tradeName: data?.trade_name || data?.tradeNam || data?.tradeNam || data?.trade_name || data?.trade || undefined,
      businessName: data?.trade_name || data?.lgnm || undefined,
      gstStatus: data?.gstin_status || data?.sts || undefined,
      gstStateCode: data?.stjcd || data?.state_code || undefined,
      businessType: data?.dty || data?.constitution_of_business || undefined,
      address: (() => {
        const pr = data?.pradr?.addr || data?.principal_place_of_business || {};
        const bno = pr?.bno || pr?.building_name || "";
        const flno = pr?.flno || pr?.floor_number || "";
        const loc = pr?.loc || pr?.location || "";
        const st = pr?.st || pr?.street || "";
        const dst = pr?.dst || pr?.district || "";
        const pncd = pr?.pncd || pr?.pincode || "";
        const stcd = pr?.stcd || pr?.state || "";
        return {
          full: [bno, flno, st, loc, dst].filter(Boolean).join(", "),
          city: dst || "",
          state: stcd || "",
          pincode: String(pncd || ""),
        };
      })(),
    };
    return res.status(200).json({ success: true, data: normalized });
  } catch (err) {
    console.error("Error looking up GSTIN:", err);
    // Distinguish abort from other errors
    if (err?.name === 'AbortError') {
      // Partial fallback on timeout
      const gst = String(req.body?.gstin || "").toUpperCase().trim();
      if (gst && /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gst)) {
        const stateCode = gst.substring(0, 2);
        const panFromGstin = gst.substring(2, 12);
        return res.status(200).json({
          success: true,
          data: { gstin: gst, pan: panFromGstin, gstStateCode: stateCode },
          warning: "GST lookup timed out. Returned partial details from GSTIN."
        });
      }
      return res.status(504).json({ success: false, message: "GST lookup timed out. Please try again." });
    }
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

// PAN lookup (no reliable free name API). We validate and return normalized PAN.
export const lookupPan = async (req, res) => {
  try {
    const { pan } = req.body;
    if (!pan) {
      return res.status(400).json({ success: false, message: "PAN is required" });
    }
    const normalized = String(pan).toUpperCase().trim();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
    if (!panRegex.test(normalized)) {
      return res.status(400).json({ success: false, message: "Invalid PAN format" });
    }
    // Optional: attempt free validation endpoints if available in future
    return res.status(200).json({ success: true, data: { pan: normalized } });
  } catch (err) {
    console.error("Error looking up PAN:", err);
    return res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  }
};

// Delete client
export const deleteClient = async (req, res) => {
  try {
    const { clientId } = req.body;

    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Delete profile image from Cloudinary
    if (client.profileImagePublicId) {
      await cloudinary.uploader.destroy(client.profileImagePublicId);
    }

    await client.deleteOne();

    res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting client:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get client statistics
export const getClientStats = async (req, res) => {
  try {
    const user = req.employee || req.user;
    const query = {};
    
    // Branch-based filtering
    if (user && !["director", "superAdmin"].includes(user.role)) {
      query.branchId = user.branchId;
    }

    const totalClients = await Client.countDocuments(query);
    const activeClients = await Client.countDocuments({ ...query, isActive: true });
    const inactiveClients = await Client.countDocuments({ ...query, isActive: false });
    
    // Recent clients (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentClients = await Client.countDocuments({
      ...query,
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      message: "Client statistics fetched successfully",
      stats: {
        totalClients,
        activeClients,
        inactiveClients,
        recentClients,
      },
    });
  } catch (err) {
    console.error("Error fetching client statistics:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

// Get all branches for dropdown
export const getAllBranches = async (req, res) => {
  try {
    const branches = await Branch.find({ status: "active" })
      .select("_id branchName address")
      .sort({ branchName: 1 });

    res.status(200).json({
      success: true,
      message: "Branches fetched successfully",
      branches,
    });
  } catch (err) {
    console.error("Error fetching branches:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
