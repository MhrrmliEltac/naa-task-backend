import cloudinary from "../config/cloudinary.js";
import Content from "../models/Content.js";

// Create new content
export const createContent = async (req, res) => {
  try {
    const {
      title,
      slug,
      category,
      htmlContent,
      activeLang,
      author,
      publishStatus,
      active,
    } = req.body;

    if (!title || !slug || !category) {
      return res
        .status(400)
        .json({ message: "Title, slug, and category are required" });
    }

    const existingContent = await Content.findOne({ slug });
    if (existingContent) {
      return res
        .status(400)
        .json({ message: "Content with this slug already exists" });
    }

    let coverImageUrl = "";
    let galleryImageUrls = [];

    // Upload cover image from memory buffer
    if (req.files?.coverImage) {
      const file = req.files.coverImage[0];
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "content/cover", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });
      coverImageUrl = result.secure_url;
    }

    // Upload gallery images from memory buffers
    if (req.files?.galleryImages) {
      const uploads = await Promise.all(
        req.files.galleryImages.map((file) => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: "content/gallery", resource_type: "image" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(file.buffer);
          });
        })
      );
      galleryImageUrls = uploads.map((u) => u.secure_url);
    }

    const newContent = new Content({
      title,
      slug,
      category,
      coverImage: coverImageUrl,
      htmlContent,
      activeLang,
      galleryImages: galleryImageUrls,
      author,
      publishStatus,
      active,
    });

    const savedContent = await newContent.save();
    res
      .status(201)
      .json({ message: "Content created successfully", data: savedContent });
  } catch (error) {
    console.error("Create content error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all contents
export const getContents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      publishStatus,
      activeLang,
      active,
    } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (publishStatus) filter.publishStatus = publishStatus;
    if (activeLang) filter.activeLang = activeLang;
    if (active === "Active") filter.active = true;
    else if (active === "Inactive") filter.active = false;

    const skip = (page - 1) * limit;

    const contents = await Content.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate("author", "name email");

    const total = await Content.countDocuments(filter);

    res.status(200).json({
      data: contents,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get contents error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get single content by ID
export const getContentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    const content = await Content.findById(id).populate("author", "name email");

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.status(200).json({ data: content });
  } catch (error) {
    console.error("Get content by ID error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get content by slug
export const getContentBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({ message: "Slug is required" });
    }

    const content = await Content.findOne({ slug }).populate(
      "author",
      "name email"
    );

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.status(200).json({ data: content });
  } catch (error) {
    console.error("Get content by slug error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update content
export const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    const content = await Content.findById(id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    if (updateData.slug && updateData.slug !== content.slug) {
      const existingContent = await Content.findOne({ slug: updateData.slug });
      if (existingContent) {
        return res.status(400).json({
          message: "Content with this slug already exists",
        });
      }
    }

    // Handle cover image upload from memory buffer
    if (req.files?.coverImage) {
      const file = req.files.coverImage[0];
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "content/cover", resource_type: "image" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(file.buffer);
      });
      updateData.coverImage = result.secure_url;
    }

    // Handle gallery images upload from memory buffers
    if (req.files?.galleryImages && req.files.galleryImages.length > 0) {
      const uploads = await Promise.all(
        req.files.galleryImages.map((file) => {
          return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: "content/gallery", resource_type: "image" },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            ).end(file.buffer);
          });
        })
      );
      updateData.galleryImages = uploads.map((u) => u.secure_url);
    }

    const updatedContent = await Content.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate("author", "name email");

    res.status(200).json({
      message: "Content updated successfully",
      data: updatedContent,
    });
  } catch (error) {
    console.error("Update content error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete content
export const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    await Content.findByIdAndDelete(id);

    res.status(200).json({
      message: "Content deleted successfully",
      data: { id },
    });
  } catch (error) {
    console.error("Delete content error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Bulk delete contents
export const bulkDeleteContents = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Array of content IDs is required",
      });
    }

    const result = await Content.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      message: `${result.deletedCount} content(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Update publish status
export const updatePublishStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { publishStatus } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Content ID is required" });
    }

    if (!publishStatus) {
      return res.status(400).json({ message: "Publish status is required" });
    }

    const validStatuses = ["draft", "published", "archived"];
    if (!validStatuses.includes(publishStatus)) {
      return res.status(400).json({
        message:
          "Invalid publish status. Must be: draft, published, or archived",
      });
    }

    const content = await Content.findByIdAndUpdate(
      id,
      { publishStatus, updatedAt: Date.now() },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    res.status(200).json({
      message: "Publish status updated successfully",
      data: content,
    });
  } catch (error) {
    console.error("Update publish status error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
