// One-time script to fix existing services with null slugs
import mongoose from 'mongoose';
import Service from './models/service.js';

const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const generateUniqueSlug = async (baseSlug, excludeId) => {
  let slug = baseSlug;
  let counter = 1;
  
  while (await Service.findOne({ slug, _id: { $ne: excludeId } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};

async function fixSlugs() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    
    const servicesWithoutSlug = await Service.find({ $or: [{ slug: null }, { slug: { $exists: false } }] });
    
    console.log(`Found ${servicesWithoutSlug.length} services without slugs`);
    
    for (const service of servicesWithoutSlug) {
      const baseSlug = generateSlug(service.title);
      const uniqueSlug = await generateUniqueSlug(baseSlug, service._id);
      
      await Service.findByIdAndUpdate(service._id, { slug: uniqueSlug });
      console.log(`Updated service "${service.title}" with slug: "${uniqueSlug}"`);
    }
    
    console.log('Slug fix completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing slugs:', error);
    process.exit(1);
  }
}

fixSlugs();
