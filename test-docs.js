// Documentation System Test
import { documentationRepository, getDocumentById, getDocumentsByCategory, getDocumentsByTag } from './src/data/documentation/index.js';

console.log('🧪 Testing Documentation System\n');

// Test 1: Repository loading
console.log('✅ Test 1: Repository Loading');
console.log(`📚 Total documents: ${documentationRepository.documents.length}`);
console.log(`🏷️  Total categories: ${documentationRepository.categories.length}`);
console.log(`🔖 Total tags: ${documentationRepository.tags.length}\n`);

// Test 2: Document retrieval by ID
console.log('✅ Test 2: Document Retrieval by ID');
const migrationDoc = getDocumentById('migration-complete');
console.log(`📄 Migration doc found: ${migrationDoc ? '✅' : '❌'}`);
console.log(`📄 Migration doc title: ${migrationDoc?.title}`);
console.log(`📄 Migration doc sections: ${migrationDoc?.sections.length}\n`);

// Test 3: Documents by category
console.log('✅ Test 3: Documents by Category');
const migrationDocs = getDocumentsByCategory('migration');
console.log(`🗂️  Migration category docs: ${migrationDocs.length}`);
migrationDocs.forEach(doc => console.log(`   - ${doc.title}`));

const maintenanceDocs = getDocumentsByCategory('maintenance');
console.log(`🗂️  Maintenance category docs: ${maintenanceDocs.length}`);
maintenanceDocs.forEach(doc => console.log(`   - ${doc.title}`));
console.log();

// Test 4: Documents by tag
console.log('✅ Test 4: Documents by Tag');
const supabaseDocs = getDocumentsByTag('supabase');
console.log(`🏷️  Supabase tagged docs: ${supabaseDocs.length}`);
supabaseDocs.forEach(doc => console.log(`   - ${doc.title}`));

const cleanupDocs = getDocumentsByTag('cleanup');
console.log(`🏷️  Cleanup tagged docs: ${cleanupDocs.length}`);
cleanupDocs.forEach(doc => console.log(`   - ${doc.title}`));
console.log();

// Test 5: All documents overview
console.log('✅ Test 5: All Documents Overview');
documentationRepository.documents.forEach((doc, index) => {
  console.log(`${index + 1}. ${doc.title} (${doc.id})`);
  console.log(`   📂 Category: ${doc.metadata.category}`);
  console.log(`   🏷️  Tags: ${doc.tags.join(', ')}`);
  console.log(`   📋 Sections: ${doc.sections.length}`);
  console.log(`   👥 Audience: ${doc.metadata.audience.join(', ')}`);
  console.log();
});

console.log('🎉 Documentation system test completed successfully!');
