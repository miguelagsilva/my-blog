const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'content', 'posts');
const outputPath = path.join(process.cwd(), 'app', 'lib', 'posts-data.json');

function generatePostsData() {
  if (!fs.existsSync(postsDirectory)) {
    console.warn(`Posts directory not found: ${postsDirectory}`);
    fs.writeFileSync(outputPath, JSON.stringify([], null, 2));
    return;
  }

  const files = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
  
  const posts = files.map(file => {
    const slug = file.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, file);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const coverImage = data.image || `/images/posts/${slug}.svg`;

    return {
      slug,
      title: data.title || '',
      date: data.date || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      excerpt: data.excerpt || '',
      author: data.author || undefined,
      content,
      coverImage,
    };
  });

  // Sort by date (newest first)
  posts.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return 0;
  });

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(posts, null, 2));
  console.log(`✓ Generated posts data: ${posts.length} posts -> ${outputPath}`);
}

generatePostsData();
