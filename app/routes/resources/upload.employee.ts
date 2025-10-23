import { json, type ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/middleware/authMiddleware.server';
import { uploadConfig } from '~/config/env.server';
import { APP_CONSTANTS } from '~/config/constants';
import { ValidationError } from '~/middleware/errorMiddleware.server';

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const employeeId = formData.get('employeeId') as string;
    const documentType = formData.get('documentType') as string;
    
    if (!file) {
      throw new ValidationError('No file provided');
    }
    
    if (!employeeId) {
      throw new ValidationError('Employee ID is required');
    }
    
    if (!documentType) {
      throw new ValidationError('Document type is required');
    }
    
    // Validate file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension || !uploadConfig.allowedTypes.includes(fileExtension)) {
      throw new ValidationError(
        `Invalid file type. Allowed types: ${uploadConfig.allowedTypes.join(', ')}`
      );
    }
    
    // Validate file size
    if (file.size > uploadConfig.maxFileSize) {
      throw new ValidationError(
        `File size exceeds maximum limit of ${uploadConfig.maxFileSize / 1024 / 1024}MB`
      );
    }
    
    // Process file upload
    const fileBuffer = await file.arrayBuffer();
    const fileName = `${employeeId}_${documentType}_${Date.now()}.${fileExtension}`;
    
    // In a real implementation, you would save the file to storage
    // For now, we'll just return success
    const uploadResult = {
      fileName,
      originalName: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
      uploadedBy: user.id,
    };
    
    return json({
      success: true,
      message: APP_CONSTANTS.SUCCESS_MESSAGES.DOCUMENT_UPLOADED,
      file: uploadResult,
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
