import { assertNonEmptyString, assertNotNullish, type CategoryInput, slugify } from "@repo/common";
import { prisma } from "@repo/db";

export async function findOrCreateCategory(input: CategoryInput): Promise<string> {
    const name = assertNonEmptyString(input.name, "category.name");
    const slug = input.slug?.trim() ? input.slug.trim() : slugify(name);

    if (!slug) {
        throw new Error("Invalid category.slug");
    }

    const parent = input.parent ?? null;

    // Ensure parent exists first (if provided).
    const parentId = parent ? await findOrCreateCategory(parent) : null;

    const existing = await prisma.businessCategory.findUnique({
        where: { slug },
    });

    // If the category already exists, we may still need to attach the parent.
    if (existing) {
        if (parentId && !existing.parentId) {
            await prisma.businessCategory.update({
                where: { id: existing.id },
                data: { parentId },
            });
        }
        return existing.id;
    }

    try {
        const created = await prisma.businessCategory.create({
            data: {
                name,
                slug,
                parentId,
                ctaType: assertNonEmptyString(input.ctaType, "category.ctaType"),
                // prisma expects a Json value; cast to avoid needing @prisma/client types here.
                sitemapTemplate: assertNotNullish(input.sitemapTemplate, "category.sitemapTemplate") as any,
            },
        });
        return created.id;
    } catch (err: unknown) {
        // Handle race conditions: someone else created the same slug.
        if (typeof err === "object" && err !== null && "code" in err) {
            const code = (err as { code?: string }).code;
            if (code === "P2002") {
                const retry = await prisma.businessCategory.findUnique({ where: { slug } });
                if (retry) return retry.id;
            }
        }
        throw err;
    }
}
