import Service from "../models/service.js";
import { v2 as cloudinary } from "cloudinary";

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Helper function to ensure unique slug
const generateUniqueSlug = async (baseSlug) => {
  let slug = baseSlug;
  let counter = 1;
  
  while (await Service.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

export const createService = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      gender,
      category,
      subcategory,
      pricing,
      estimatedDays,
      features,
      tags,
      status,
      isPopular,
      isFeatured,
    } = req.body;

    // Validate required fields
    if (!title || !description || !gender || !category || !pricing) {
      return res.status(400).json({
      success: false,
        message: "Title, description, gender, category, and pricing are required.",
      });
    }

    const existing = await Service.findOne({ title });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Service with this title already exists.",
      });
    }

    let serviceImage = "";
    let serviceImagePublicId = "";
    let secondaryServiceImage = "";
    let secondaryServiceImagePublicId = "";
    if (req.files && req.files.serviceImage) {
      serviceImage = req.files.serviceImage[0].path;
      serviceImagePublicId = req.files.serviceImage[0].filename;
    }
    if (req.files && req.files.secondaryServiceImage) {
      secondaryServiceImage = req.files.secondaryServiceImage[0].path;
      secondaryServiceImagePublicId = req.files.secondaryServiceImage[0].filename;
    }

    // Parse pricing if it's a string
    let parsedPricing = pricing;
    if (typeof pricing === 'string') {
      parsedPricing = JSON.parse(pricing);
    }

    // Parse features if it's a string
    let parsedFeatures = features;
    if (typeof features === 'string') {
      parsedFeatures = JSON.parse(features);
    }

    // Parse tags if it's a string
    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = JSON.parse(tags);
    }

    // Generate unique slug from title
    const baseSlug = generateSlug(title);
    const uniqueSlug = await generateUniqueSlug(baseSlug);

    const service = await Service.create({
      title,
      description,
      shortDescription,
      gender,
      category,
      subcategory,
      pricing: parsedPricing,
      estimatedDays: estimatedDays || "1",
      features: parsedFeatures || [],
      tags: parsedTags || [],
      slug: uniqueSlug,
      serviceImage,
      serviceImagePublicId,
      secondaryServiceImage,
      secondaryServiceImagePublicId,
      status: status || 'active',
      isPopular: isPopular === 'true' || false,
      isFeatured: isFeatured === 'true' || false,
      createdBy: req.employee?._id || req.user?._id,
    });

    res.status(201).json({
      success: true,
      message: "Service created successfully",
      service,
    });
  } catch (err) {
    console.error("Error creating service:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const getAllServices = async (req, res) => {
  try {
    let { page, limit, search, gender, category, subcategory, status, isPopular, isFeatured } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;
    


    // Build query object step by step
    const query = {};

    // Handle search
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { subcategory: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Handle filters - only add if they have actual values and aren't "all"
    if (gender && gender.trim() !== '' && gender !== 'all') {
      query.gender = gender;
    }
    
    if (category && category.trim() !== '' && category !== 'all') {
      query.category = category;
    }
    
    if (subcategory && subcategory.trim() !== '' && subcategory !== 'all') {
      query.subcategory = subcategory;
    }
    
    if (status && status.trim() !== '' && status !== 'all') {
      query.status = status;
    }
    
    if (isPopular && isPopular !== 'undefined' && isPopular !== '') {
      query.isPopular = isPopular === 'true';
    }

    if (isFeatured && isFeatured !== 'undefined' && isFeatured !== '') {
      query.isFeatured = isFeatured === 'true';
    }

    // Get services with the query
    const services = await Service.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Service.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Services fetched successfully",
      services,
      page,
      limit,
      total,
      currentPageCount: services.length,
      totalPage: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching services",
    });
  }
};

export const getServiceById = async (req, res) => {
              try {
    const { serviceId } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Service fetched successfully",
      service,
    });
  } catch (err) {
    console.error("Error fetching service by ID:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

export const updateService = async (req, res) => {
  try {
    const {
      serviceId,
      title,
      description,
      shortDescription,
      gender,
      category,
      subcategory,
      pricing,
      estimatedDays,
      features,
      tags,
      status,
      isPopular,
      isFeatured,
    } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    if (req.files && req.files.serviceImage) {
      if (service.serviceImagePublicId) {
        await cloudinary.uploader.destroy(service.serviceImagePublicId)
      }
      service.serviceImage = req.files.serviceImage[0].path;
      service.serviceImagePublicId = req.files.serviceImage[0].filename;
    }
    if (req.files && req.files.secondaryServiceImage) {
      if (service.secondaryServiceImagePublicId) {
        await cloudinary.uploader.destroy(service.secondaryServiceImagePublicId)
      }
      service.secondaryServiceImage = req.files.secondaryServiceImage[0].path;
      service.secondaryServiceImagePublicId = req.files.secondaryServiceImage[0].filename;
  }

    // Parse pricing if it's a string
    let parsedPricing = pricing;
    if (typeof pricing === 'string') {
      parsedPricing = JSON.parse(pricing);
    }

    // Parse features if it's a string
    let parsedFeatures = features;
    if (typeof features === 'string') {
      parsedFeatures = JSON.parse(features);
    }

    // Parse tags if it's a string
    let parsedTags = tags;
    if (typeof tags === 'string') {
      parsedTags = JSON.parse(tags);
  }

    // Update slug if title is changing
    if (title && title !== service.title) {
      const baseSlug = generateSlug(title);
      const uniqueSlug = await generateUniqueSlug(baseSlug);
      service.slug = uniqueSlug;
    }

    service.title = title || service.title;
    service.description = description || service.description;
    service.shortDescription = shortDescription || service.shortDescription;
    service.gender = gender || service.gender;
    service.category = category || service.category;
    service.subcategory = subcategory || service.subcategory;
    service.pricing = parsedPricing ?? service.pricing;
    service.estimatedDays = estimatedDays || service.estimatedDays;
    service.features = parsedFeatures ?? service.features;
    service.tags = parsedTags ?? service.tags;
    service.status = status || service.status;
    service.isPopular = isPopular !== undefined ? (isPopular === 'true') : service.isPopular;
    service.isFeatured = isFeatured !== undefined ? (isFeatured === 'true') : service.isFeatured;
    service.updatedBy = req.employee?._id || req.user?._id;

    await service.save();

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (err) {
    console.error("Error updating service:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update service",
      error: err.message,
    });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: "Service not found",
      });
    }

    // Delete images from Cloudinary
    if (service.serviceImagePublicId) {
      await cloudinary.uploader.destroy(service.serviceImagePublicId);
    }
    if (service.secondaryServiceImagePublicId) {
      await cloudinary.uploader.destroy(service.secondaryServiceImagePublicId);
    }

    await service.deleteOne();

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting service:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
}; 