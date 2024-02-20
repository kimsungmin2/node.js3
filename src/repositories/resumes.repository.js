export class ResumesRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    createResume = async (userId, title, content, status) => {
        const resume = await this.prisma.resumes.create({
            data: {
                userId: +userId,
                title,
                content,
                status,
            },
        });
        return resume;
    };

    getResumes = async (orderKey, orderValue) => {
        let orderBy = {};
        if (orderKey) {
            orderBy[orderKey] = orderValue && orderValue.toUpperCase() === "ASC" ? "asc" : "desc";
        } else {
            orderBy = { createdAt: "desc" };
        }

        const resumes = await this.prisma.resumes.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
            orderBy,
        });

        return resumes;
    };

    getResumeById = async (resumeId) => {
        const user = await this.prisma.resumes.findFirst({
            where: { resumeId: +resumeId },
        });
        return user;
    };

    updateResume = async (resumeId, title, content, status) => {
        const updatedResume = await this.prisma.resumes.update({
            where: { resumeId: +resumeId },
            data: { title, content, status },
        });

        return updatedResume;
    };

    deleteResume = async (resumeId, userId) => {
        const deletedResume = await this.prisma.resumes.delete({
            where: {
                resumeId: +resumeId,
                userId: +userId,
            },
        });
        return deletedResume;
    };
}
