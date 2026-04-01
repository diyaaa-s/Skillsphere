// MongoDB initialization script
// Runs once when the container is first created

db = db.getSiblingDB('skillsphere');

// Create indexes
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ category: 1 });
db.skills.createIndex({ category: 1, isActive: 1 });
db.skills.createIndex({ title: "text", description: "text", tags: "text" });

print('✅ SkillSphere DB initialized with indexes');
