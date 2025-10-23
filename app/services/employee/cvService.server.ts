import { prisma } from '../../lib/prisma.server';
import { APP_CONSTANTS } from '../../config/constants';

export interface CVData {
  employeeId: string;
  template: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: Date;
    gender: string;
    nationality: string;
    address: string;
  };
  skills: string[];
  experience: {
    position: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  languages: {
    language: string;
    level: string;
  }[];
  references?: {
    name: string;
    position: string;
    company: string;
    phone: string;
  }[];
}

export interface CVTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  preview: string;
  fields: string[];
}

export class CVService {
  // Available CV templates
  static readonly TEMPLATES: CVTemplate[] = [
    {
      id: 'modern',
      name: 'Modern Professional',
      description: 'Clean and modern design for professional roles',
      category: 'Professional',
      preview: '/templates/modern-preview.jpg',
      fields: ['personalInfo', 'skills', 'experience', 'education', 'languages'],
    },
    {
      id: 'classic',
      name: 'Classic Traditional',
      description: 'Traditional format suitable for all industries',
      category: 'Traditional',
      preview: '/templates/classic-preview.jpg',
      fields: ['personalInfo', 'experience', 'education', 'skills', 'languages'],
    },
    {
      id: 'creative',
      name: 'Creative Design',
      description: 'Eye-catching design for creative professionals',
      category: 'Creative',
      preview: '/templates/creative-preview.jpg',
      fields: ['personalInfo', 'skills', 'experience', 'education', 'references'],
    },
    {
      id: 'minimal',
      name: 'Minimal Clean',
      description: 'Simple and clean design focusing on content',
      category: 'Minimal',
      preview: '/templates/minimal-preview.jpg',
      fields: ['personalInfo', 'experience', 'skills'],
    },
  ];

  // Get all available templates
  static getTemplates(): CVTemplate[] {
    return this.TEMPLATES;
  }

  // Get template by ID
  static getTemplate(templateId: string): CVTemplate | undefined {
    return this.TEMPLATES.find(template => template.id === templateId);
  }

  // Generate CV data from employee information
  static async generateCVData(employeeId: string): Promise<CVData> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        documents: true,
      },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    return {
      employeeId: employee.id,
      template: 'modern', // Default template
      personalInfo: {
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        dateOfBirth: employee.dateOfBirth,
        gender: employee.gender,
        nationality: employee.nationality,
        address: `${employee.address}, ${employee.city}, ${employee.region}`,
      },
      skills: employee.skills || [],
      experience: employee.experience || [],
      education: employee.education || [],
      languages: employee.languages || [],
      references: employee.references || [],
    };
  }

  // Save CV data
  static async saveCVData(cvData: CVData) {
    return prisma.employee.update({
      where: { id: cvData.employeeId },
      data: {
        cvData: JSON.stringify(cvData),
        cvTemplate: cvData.template,
        cvGeneratedAt: new Date(),
      },
    });
  }

  // Generate CV PDF
  static async generateCVPDF(cvData: CVData): Promise<Buffer> {
    // This would integrate with a PDF generation library like Puppeteer or PDFKit
    // For now, return a mock implementation
    
    const template = this.getTemplate(cvData.template);
    if (!template) {
      throw new Error('Template not found');
    }

    // Mock PDF generation
    const pdfContent = this.generatePDFContent(cvData, template);
    
    // In a real implementation, you would use a PDF library here
    return Buffer.from(pdfContent, 'utf-8');
  }

  // Generate PDF content (mock implementation)
  private static generatePDFContent(cvData: CVData, template: CVTemplate): string {
    const { personalInfo, skills, experience, education, languages } = cvData;
    
    return `
      CV - ${personalInfo.firstName} ${personalInfo.lastName}
      
      Personal Information:
      Email: ${personalInfo.email}
      Phone: ${personalInfo.phone}
      Nationality: ${personalInfo.nationality}
      Address: ${personalInfo.address}
      
      Skills:
      ${skills.join(', ')}
      
      Experience:
      ${experience.map(exp => `${exp.position} at ${exp.company} (${exp.duration})`).join('\n')}
      
      Education:
      ${education.map(edu => `${edu.degree} from ${edu.institution} (${edu.year})`).join('\n')}
      
      Languages:
      ${languages.map(lang => `${lang.language} - ${lang.level}`).join('\n')}
    `;
  }

  // Upload CV file
  static async uploadCV(employeeId: string, file: File) {
    // Validate file type
    const allowedTypes = APP_CONSTANTS.ALLOWED_FILE_TYPES.DOCUMENTS;
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      throw new Error('Invalid file type. Only PDF, DOC, DOCX files are allowed.');
    }

    // Validate file size
    if (file.size > APP_CONSTANTS.MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${APP_CONSTANTS.MAX_FILE_SIZE / 1024 / 1024}MB`);
    }

    // Save file information to database
    return prisma.document.create({
      data: {
        employeeId,
        type: 'cv',
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        status: 'pending',
        uploadedAt: new Date(),
      },
    });
  }

  // Get CV for employee
  static async getEmployeeCV(employeeId: string) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        cvData: true,
        cvTemplate: true,
        cvGeneratedAt: true,
        documents: {
          where: { type: 'cv' },
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });

    if (!employee) {
      throw new Error('Employee not found');
    }

    return {
      cvData: employee.cvData ? JSON.parse(employee.cvData) : null,
      template: employee.cvTemplate,
      generatedAt: employee.cvGeneratedAt,
      uploadedFiles: employee.documents,
    };
  }

  // Delete CV
  static async deleteCV(employeeId: string) {
    return prisma.employee.update({
      where: { id: employeeId },
      data: {
        cvData: null,
        cvTemplate: null,
        cvGeneratedAt: null,
      },
    });
  }

  // Search CVs by skills
  static async searchCVsBySkills(skills: string[]) {
    return prisma.employee.findMany({
      where: {
        skills: {
          hasSome: skills,
        },
        cvData: {
          not: null,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        skills: true,
        cvTemplate: true,
        cvGeneratedAt: true,
      },
    });
  }

  // Get CV statistics
  static async getCVStats() {
    const [
      totalEmployees,
      employeesWithCV,
      templatesUsed,
    ] = await Promise.all([
      prisma.employee.count(),
      prisma.employee.count({
        where: {
          cvData: {
            not: null,
          },
        },
      }),
      prisma.employee.groupBy({
        by: ['cvTemplate'],
        _count: { cvTemplate: true },
        where: {
          cvTemplate: {
            not: null,
          },
        },
      }),
    ]);

    const templateStats: Record<string, number> = {};
    templatesUsed.forEach(item => {
      if (item.cvTemplate) {
        templateStats[item.cvTemplate] = item._count.cvTemplate;
      }
    });

    return {
      totalEmployees,
      employeesWithCV,
      employeesWithoutCV: totalEmployees - employeesWithCV,
      cvGenerationRate: totalEmployees > 0 ? (employeesWithCV / totalEmployees) * 100 : 0,
      templateStats,
    };
  }

  // Export CV data
  static async exportCVData(employeeIds: string[]) {
    const employees = await prisma.employee.findMany({
      where: {
        id: {
          in: employeeIds,
        },
        cvData: {
          not: null,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        cvData: true,
        cvTemplate: true,
        cvGeneratedAt: true,
      },
    });

    return employees.map(employee => ({
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.email,
      template: employee.cvTemplate,
      generatedAt: employee.cvGeneratedAt,
      cvData: employee.cvData ? JSON.parse(employee.cvData) : null,
    }));
  }
}

// Export singleton instance
export const cvService = CVService;
