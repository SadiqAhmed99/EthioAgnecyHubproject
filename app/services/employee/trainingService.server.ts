import { prisma } from '../../lib/prisma.server';
import { APP_CONSTANTS } from '../../config/constants';

export interface TrainingProgram {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: number; // in hours
  level: 'beginner' | 'intermediate' | 'advanced';
  requirements: string[];
  objectives: string[];
  modules: {
    id: string;
    name: string;
    description: string;
    duration: number;
    content: string[];
  }[];
}

export interface TrainingRecord {
  id: string;
  employeeId: string;
  programId: string;
  status: 'enrolled' | 'in_progress' | 'completed' | 'failed';
  enrolledAt: Date;
  completedAt?: Date;
  score?: number;
  certificate?: string;
  notes?: string;
}

export interface TrainingStats {
  totalPrograms: number;
  totalEnrollments: number;
  completedTrainings: number;
  averageScore: number;
  byCategory: Record<string, number>;
  byLevel: Record<string, number>;
}

export class TrainingService {
  // Available training programs
  static readonly PROGRAMS: TrainingProgram[] = [
    {
      id: 'domestic-skills',
      name: 'Domestic Work Skills',
      description: 'Comprehensive training for domestic work positions',
      category: 'Domestic Work',
      duration: 40,
      level: 'beginner',
      requirements: ['Basic literacy', 'Physical fitness'],
      objectives: [
        'Learn proper cleaning techniques',
        'Understand household management',
        'Develop communication skills',
        'Learn safety protocols',
      ],
      modules: [
        {
          id: 'cleaning-techniques',
          name: 'Cleaning Techniques',
          description: 'Professional cleaning methods and tools',
          duration: 8,
          content: [
            'Different cleaning products and their uses',
            'Proper cleaning techniques for different surfaces',
            'Organization and time management',
            'Eco-friendly cleaning practices',
          ],
        },
        {
          id: 'household-management',
          name: 'Household Management',
          description: 'Managing household tasks efficiently',
          duration: 12,
          content: [
            'Meal planning and preparation',
            'Laundry and clothing care',
            'Home organization',
            'Budget management',
          ],
        },
        {
          id: 'communication-skills',
          name: 'Communication Skills',
          description: 'Effective communication with employers',
          duration: 8,
          content: [
            'Professional communication',
            'Conflict resolution',
            'Cultural sensitivity',
            'Language skills',
          ],
        },
        {
          id: 'safety-protocols',
          name: 'Safety Protocols',
          description: 'Safety measures and emergency procedures',
          duration: 12,
          content: [
            'Home safety measures',
            'Emergency procedures',
            'First aid basics',
            'Child safety',
          ],
        },
      ],
    },
    {
      id: 'healthcare-basics',
      name: 'Healthcare Assistant Training',
      description: 'Basic healthcare and elderly care training',
      category: 'Healthcare',
      duration: 60,
      level: 'intermediate',
      requirements: ['High school education', 'Medical clearance'],
      objectives: [
        'Learn basic healthcare procedures',
        'Understand elderly care needs',
        'Develop patient care skills',
        'Learn medical terminology',
      ],
      modules: [
        {
          id: 'basic-healthcare',
          name: 'Basic Healthcare Procedures',
          description: 'Essential healthcare procedures and protocols',
          duration: 20,
          content: [
            'Vital signs monitoring',
            'Medication administration',
            'Wound care',
            'Infection control',
          ],
        },
        {
          id: 'elderly-care',
          name: 'Elderly Care',
          description: 'Specialized care for elderly patients',
          duration: 20,
          content: [
            'Age-related health conditions',
            'Mobility assistance',
            'Nutritional needs',
            'Mental health support',
          ],
        },
        {
          id: 'patient-care',
          name: 'Patient Care Skills',
          description: 'Compassionate patient care techniques',
          duration: 12,
          content: [
            'Patient comfort measures',
            'Personal hygiene assistance',
            'Emotional support',
            'Family communication',
          ],
        },
        {
          id: 'medical-terminology',
          name: 'Medical Terminology',
          description: 'Understanding medical terms and procedures',
          duration: 8,
          content: [
            'Common medical terms',
            'Body systems',
            'Medication names',
            'Medical equipment',
          ],
        },
      ],
    },
    {
      id: 'language-arabic',
      name: 'Arabic Language Course',
      description: 'Arabic language training for Middle East employment',
      category: 'Language',
      duration: 80,
      level: 'beginner',
      requirements: ['Basic literacy in native language'],
      objectives: [
        'Learn basic Arabic vocabulary',
        'Understand common phrases',
        'Develop conversation skills',
        'Learn cultural etiquette',
      ],
      modules: [
        {
          id: 'basic-vocabulary',
          name: 'Basic Vocabulary',
          description: 'Essential Arabic words and phrases',
          duration: 20,
          content: [
            'Greetings and introductions',
            'Numbers and time',
            'Family and relationships',
            'Common objects',
          ],
        },
        {
          id: 'conversation-skills',
          name: 'Conversation Skills',
          description: 'Basic conversation in Arabic',
          duration: 30,
          content: [
            'Daily conversations',
            'Asking for help',
            'Giving directions',
            'Shopping and transactions',
          ],
        },
        {
          id: 'cultural-etiquette',
          name: 'Cultural Etiquette',
          description: 'Understanding Arab culture and customs',
          duration: 20,
          content: [
            'Cultural norms',
            'Religious practices',
            'Social interactions',
            'Workplace etiquette',
          ],
        },
        {
          id: 'workplace-arabic',
          name: 'Workplace Arabic',
          description: 'Arabic for work situations',
          duration: 10,
          content: [
            'Work-related vocabulary',
            'Professional communication',
            'Understanding instructions',
            'Reporting and feedback',
          ],
        },
      ],
    },
    {
      id: 'safety-security',
      name: 'Safety and Security Training',
      description: 'Workplace safety and security protocols',
      category: 'Safety',
      duration: 24,
      level: 'beginner',
      requirements: ['Physical fitness', 'Clean criminal record'],
      objectives: [
        'Learn workplace safety protocols',
        'Understand emergency procedures',
        'Develop security awareness',
        'Learn first aid basics',
      ],
      modules: [
        {
          id: 'workplace-safety',
          name: 'Workplace Safety',
          description: 'General workplace safety measures',
          duration: 8,
          content: [
            'Safety equipment usage',
            'Hazard identification',
            'Safe work practices',
            'Accident prevention',
          ],
        },
        {
          id: 'emergency-procedures',
          name: 'Emergency Procedures',
          description: 'Handling emergency situations',
          duration: 8,
          content: [
            'Fire safety',
            'Evacuation procedures',
            'Emergency contacts',
            'Crisis management',
          ],
        },
        {
          id: 'security-awareness',
          name: 'Security Awareness',
          description: 'Security measures and protocols',
          duration: 4,
          content: [
            'Access control',
            'Surveillance awareness',
            'Reporting suspicious activities',
            'Personal security',
          ],
        },
        {
          id: 'first-aid',
          name: 'First Aid Basics',
          description: 'Basic first aid procedures',
          duration: 4,
          content: [
            'CPR basics',
            'Wound treatment',
            'Emergency response',
            'Medical emergencies',
          ],
        },
      ],
    },
  ];

  // Get all training programs
  static getTrainingPrograms(): TrainingProgram[] {
    return this.PROGRAMS;
  }

  // Get training program by ID
  static getTrainingProgram(programId: string): TrainingProgram | undefined {
    return this.PROGRAMS.find(program => program.id === programId);
  }

  // Get training programs by category
  static getTrainingProgramsByCategory(category: string): TrainingProgram[] {
    return this.PROGRAMS.filter(program => program.category === category);
  }

  // Enroll employee in training
  static async enrollEmployee(employeeId: string, programId: string) {
    const program = this.getTrainingProgram(programId);
    if (!program) {
      throw new Error('Training program not found');
    }

    // Check if employee is already enrolled
    const existingEnrollment = await prisma.trainingRecord.findFirst({
      where: {
        employeeId,
        programId,
        status: {
          in: ['enrolled', 'in_progress'],
        },
      },
    });

    if (existingEnrollment) {
      throw new Error('Employee is already enrolled in this program');
    }

    return prisma.trainingRecord.create({
      data: {
        employeeId,
        programId,
        status: 'enrolled',
        enrolledAt: new Date(),
      },
    });
  }

  // Update training progress
  static async updateTrainingProgress(
    recordId: string,
    status: 'in_progress' | 'completed' | 'failed',
    score?: number,
    notes?: string
  ) {
    const updateData: any = {
      status,
      notes,
    };

    if (status === 'completed') {
      updateData.completedAt = new Date();
      updateData.score = score;
      // Generate certificate
      updateData.certificate = `certificate_${recordId}_${Date.now()}.pdf`;
    }

    return prisma.trainingRecord.update({
      where: { id: recordId },
      data: updateData,
    });
  }

  // Get employee training records
  static async getEmployeeTrainingRecords(employeeId: string) {
    return prisma.trainingRecord.findMany({
      where: { employeeId },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  // Get training statistics
  static async getTrainingStats(): Promise<TrainingStats> {
    const [
      totalPrograms,
      totalEnrollments,
      completedTrainings,
      averageScore,
      byCategory,
      byLevel,
    ] = await Promise.all([
      this.PROGRAMS.length,
      prisma.trainingRecord.count(),
      prisma.trainingRecord.count({
        where: { status: 'completed' },
      }),
      prisma.trainingRecord.aggregate({
        _avg: { score: true },
        where: { status: 'completed' },
      }),
      prisma.trainingRecord.groupBy({
        by: ['programId'],
        _count: { programId: true },
      }),
      prisma.trainingRecord.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
    ]);

    const categoryStats: Record<string, number> = {};
    byCategory.forEach(item => {
      const program = this.getTrainingProgram(item.programId);
      if (program) {
        categoryStats[program.category] = (categoryStats[program.category] || 0) + item._count.programId;
      }
    });

    const levelStats: Record<string, number> = {};
    byLevel.forEach(item => {
      levelStats[item.status] = item._count.status;
    });

    return {
      totalPrograms,
      totalEnrollments,
      completedTrainings,
      averageScore: averageScore._avg.score || 0,
      byCategory: categoryStats,
      byLevel: levelStats,
    };
  }

  // Get employees by training completion
  static async getEmployeesByTrainingCompletion(programId: string) {
    return prisma.trainingRecord.findMany({
      where: { programId },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            status: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  // Generate training certificate
  static async generateTrainingCertificate(recordId: string): Promise<Buffer> {
    const record = await prisma.trainingRecord.findUnique({
      where: { id: recordId },
      include: {
        employee: true,
      },
    });

    if (!record || record.status !== 'completed') {
      throw new Error('Training not completed');
    }

    const program = this.getTrainingProgram(record.programId);
    if (!program) {
      throw new Error('Training program not found');
    }

    // Mock certificate generation
    const certificateContent = `
      CERTIFICATE OF COMPLETION
      
      This certifies that
      ${record.employee.firstName} ${record.employee.lastName}
      
      has successfully completed the
      ${program.name}
      
      Training Program
      
      Duration: ${program.duration} hours
      Completion Date: ${record.completedAt?.toLocaleDateString()}
      Score: ${record.score || 'N/A'}
      
      Certificate ID: ${record.certificate}
    `;

    return Buffer.from(certificateContent, 'utf-8');
  }

  // Search training programs
  static searchTrainingPrograms(query: string): TrainingProgram[] {
    const lowercaseQuery = query.toLowerCase();
    
    return this.PROGRAMS.filter(program =>
      program.name.toLowerCase().includes(lowercaseQuery) ||
      program.description.toLowerCase().includes(lowercaseQuery) ||
      program.category.toLowerCase().includes(lowercaseQuery) ||
      program.objectives.some(objective => 
        objective.toLowerCase().includes(lowercaseQuery)
      )
    );
  }

  // Get recommended training programs for employee
  static async getRecommendedTrainingPrograms(employeeId: string): Promise<TrainingProgram[]> {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        skills: true,
        experienceLevel: true,
        languages: true,
      },
    });

    if (!employee) {
      return [];
    }

    // Simple recommendation logic based on skills and experience
    const recommendations: TrainingProgram[] = [];

    // Recommend domestic skills training for domestic work skills
    if (employee.skills?.some(skill => 
      ['housekeeping', 'cooking', 'childcare'].includes(skill.toLowerCase())
    )) {
      const domesticProgram = this.getTrainingProgram('domestic-skills');
      if (domesticProgram) recommendations.push(domesticProgram);
    }

    // Recommend healthcare training for healthcare skills
    if (employee.skills?.some(skill => 
      ['healthcare', 'elderly care', 'nursing'].includes(skill.toLowerCase())
    )) {
      const healthcareProgram = this.getTrainingProgram('healthcare-basics');
      if (healthcareProgram) recommendations.push(healthcareProgram);
    }

    // Recommend Arabic language training
    if (!employee.languages?.some(lang => 
      lang.language.toLowerCase().includes('arabic')
    )) {
      const arabicProgram = this.getTrainingProgram('language-arabic');
      if (arabicProgram) recommendations.push(arabicProgram);
    }

    // Always recommend safety training
    const safetyProgram = this.getTrainingProgram('safety-security');
    if (safetyProgram) recommendations.push(safetyProgram);

    return recommendations;
  }

  // Export training data
  static async exportTrainingData(programId?: string) {
    const where = programId ? { programId } : {};
    
    const records = await prisma.trainingRecord.findMany({
      where,
      include: {
        employee: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return records.map(record => ({
      id: record.id,
      employeeName: `${record.employee.firstName} ${record.employee.lastName}`,
      employeeEmail: record.employee.email,
      programId: record.programId,
      status: record.status,
      enrolledAt: record.enrolledAt,
      completedAt: record.completedAt,
      score: record.score,
      certificate: record.certificate,
    }));
  }
}

// Export singleton instance
export const trainingService = TrainingService;
