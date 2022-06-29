import prisma from ".";

export const getAllPages = async () => {
    const pages = await prisma.page.findMany();
    return pages;
}

export const getPage = async (name: string) => {
    let page = await prisma.page.findFirst({
        where: { name: name },
    });
    return page;
}

export const upsertPage = async (name: string, body: string) => {
    const page = await prisma.page.upsert({
        where: { name: name, },
        update: {
            body: body,
        },
        create: {
            name: name,
            body: body
        }
    });
    return page;
}