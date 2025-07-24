import Enquiry from "../models/enquiry.js";
import Service from "../models/service.js";

export const createEnquiry = async (req, res) => {
  try {
    const {
      name,
      email,
      phoneNumber,
      serviceId,
      serviceName,
      message,
      source = 'services_page'
    } = req.body;

    // Validate required fields
    if (!name || !phoneNumber || !serviceId || !serviceName) {
      return res.status(400).json({
        success: false,
        message: "Name, phone number, service ID, and service name are required.",
      });
    }

    // Verify service exists
    const serviceExists = await Service.findById(serviceId);
    if (!serviceExists) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      phoneNumber,
      serviceId,
      serviceName,
      message,
      source
    });

    // Populate service details
    await enquiry.populate('serviceId', 'title category pricing');

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (err) {
    console.error("Error creating enquiry:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getAllEnquiries = async (req, res) => {
  try {
    let { page, limit, search, status, priority, source } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = {};

    // Handle search
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phoneNumber: { $regex: search, $options: "i" } },
        { serviceName: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } }
      ];
    }

    // Handle filters
    if (status && status !== 'all') query.status = status;
    if (priority && priority !== 'all') query.priority = priority;
    if (source && source !== 'all') query.source = source;

    const enquiries = await Enquiry.find(query)
      .populate('serviceId', 'title category pricing serviceImage')
      .populate('respondedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Enquiry.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Enquiries fetched successfully",
      enquiries,
      page,
      limit,
      total,
      currentPageCount: enquiries.length,
      totalPage: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching enquiries",
    });
  }
};

export const getEnquiryById = async (req, res) => {
  try {
    const { enquiryId } = req.body;
    const enquiry = await Enquiry.findById(enquiryId)
      .populate('serviceId', 'title category pricing serviceImage estimatedDays')
      .populate('respondedBy', 'name email');
      
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry fetched successfully",
      enquiry,
    });
  } catch (err) {
    console.error("Error fetching enquiry by ID:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const updateEnquiry = async (req, res) => {
  try {
    const {
      enquiryId,
      status,
      priority,
      adminNotes,
      respondedAt,
    } = req.body;

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    // Update fields
    if (status) enquiry.status = status;
    if (priority) enquiry.priority = priority;
    if (adminNotes !== undefined) enquiry.adminNotes = adminNotes;
    if (respondedAt) {
      enquiry.respondedAt = respondedAt;
      enquiry.respondedBy = req.employee?._id || req.user?._id;
    }

    await enquiry.save();

    // Populate for response
    await enquiry.populate('serviceId', 'title category pricing');
    await enquiry.populate('respondedBy', 'name email');

    res.status(200).json({
      success: true,
      message: "Enquiry updated successfully",
      enquiry,
    });
  } catch (err) {
    console.error("Error updating enquiry:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update enquiry",
      error: err.message,
    });
  }
};

export const deleteEnquiry = async (req, res) => {
  try {
    const { enquiryId } = req.body;

    const enquiry = await Enquiry.findById(enquiryId);
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    await Enquiry.findByIdAndDelete(enquiryId);

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting enquiry:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete enquiry",
      error: err.message,
    });
  }
};

// Get enquiry statistics
export const getEnquiryStats = async (req, res) => {
  try {
    const totalEnquiries = await Enquiry.countDocuments();
    const pendingEnquiries = await Enquiry.countDocuments({ status: 'pending' });
    const convertedEnquiries = await Enquiry.countDocuments({ status: 'converted' });
    
    // Get recent enquiries (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEnquiries = await Enquiry.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalEnquiries,
        pending: pendingEnquiries,
        converted: convertedEnquiries,
        recent: recentEnquiries,
        conversionRate: totalEnquiries > 0 ? ((convertedEnquiries / totalEnquiries) * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error("Error fetching enquiry stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch enquiry statistics"
    });
  }
}; 