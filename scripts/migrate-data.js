const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function migrate() {
    console.log('Starting migration...');

    try {
        // 1. Migrate Papers
        const papers = await prisma.savedpaper.findMany();
        console.log(`Found ${papers.length} papers.`);

        const paperDir = path.join(__dirname, '../src/content/papers');
        if (!fs.existsSync(paperDir)) fs.mkdirSync(paperDir, { recursive: true });

        for (const paper of papers) {
            const fileName = `${paper.year}-${paper.subject}-${paper.class}-${paper.id}.json`;
            const filePath = path.join(paperDir, fileName);

            const content = {
                examName: paper.examName,
                subject: paper.subject,
                class: paper.class,
                year: paper.year,
                data: typeof paper.data === 'string' ? JSON.parse(paper.data) : paper.data,
                createdAt: paper.createdAt instanceof Date ? paper.createdAt.toISOString() : paper.createdAt,
            };

            fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
            console.log(`Exported paper: ${fileName}`);
        }

        // 2. Migrate Offers
        const offers = await prisma.offer.findMany();
        console.log(`Found ${offers.length} offers.`);

        const offerDir = path.join(__dirname, '../src/content/offers');
        if (!fs.existsSync(offerDir)) fs.mkdirSync(offerDir, { recursive: true });

        for (const offer of offers) {
            const fileName = `${offer.code}.json`;
            const filePath = path.join(offerDir, fileName);

            const content = {
                code: offer.code,
                description: offer.description,
                discountType: offer.discountType,
                discountValue: offer.discountValue,
                isActive: offer.isActive,
            };

            fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
            console.log(`Exported offer: ${fileName}`);
        }

        console.log('Migration completed successfully!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrate();
