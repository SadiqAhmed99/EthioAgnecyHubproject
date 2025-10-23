import { json, type ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/middleware/authMiddleware.server';
import { cvService } from '~/services/employee/cvService.server';
import { ValidationError } from '~/middleware/errorMiddleware.server';
import { APP_CONSTANTS } from '~/config/constants';

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const employeeId = formData.get('employeeId') as string;
    const template = formData.get('template') as string;
    
    if (!employeeId) {
      throw new ValidationError('Employee ID is required');
    }
    
    if (!template) {
      throw new ValidationError('Template is required');
    }
    
    // Validate template
    const availableTemplates = cvService.getTemplates();
    const selectedTemplate = availableTemplates.find(t => t.id === template);
    
    if (!selectedTemplate) {
      throw new ValidationError('Invalid template selected');
    }
    
    // Generate CV data
    const cvData = await cvService.generateCVData(employeeId);
    cvData.template = template;
    
    // Generate CV PDF
    const pdfBuffer = await cvService.generateCVPDF(cvData);
    
    // Save CV data
    await cvService.saveCVData(cvData);
    
    // Return PDF as base64 for download
    const pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
    
    return json({
      success: true,
      message: 'CV generated successfully',
      cvData: {
        template: cvData.template,
        generatedAt: new Date(),
        fileName: `CV_${employeeId}_${Date.now()}.pdf`,
      },
      pdf: pdfBase64,
    });
    
  } catch (error) {
    if (error instanceof ValidationError) {
      return json({
        success: false,
        message: error.message,
      }, { status: 400 });
    }
    
    return json({
      success: false,
      message: APP_CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR,
    }, { status: 500 });
  }
}
