import { json, type ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/middleware/authMiddleware.server';
import { documentService } from '~/services/documents/documentService.server';
import { ValidationError } from '~/middleware/errorMiddleware.server';
import { APP_CONSTANTS } from '~/config/constants';

export async function uploadDocumentAction({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const employeeId = formData.get('employeeId') as string;
    const documentType = formData.get('documentType') as string;
    const documentNumber = formData.get('documentNumber') as string;
    
    if (!file) {
      throw new ValidationError('No file provided');
    }
    
    if (!employeeId) {
      throw new ValidationError('Employee ID is required');
    }
    
    if (!documentType) {
      throw new ValidationError('Document type is required');
    }
    
    // Validate document type
    if (!Object.values(APP_CONSTANTS.DOCUMENT_TYPES).includes(documentType)) {
      throw new ValidationError('Invalid document type');
    }
    
    // Upload document
    const document = await documentService.uploadDocument(employeeId, file);
    
    // Update document number if provided
    if (documentNumber) {
      await documentService.updateDocument(document.id, { documentNumber });
    }
    
    return json({
      success: true,
      message: APP_CONSTANTS.SUCCESS_MESSAGES.DOCUMENT_UPLOADED,
      document,
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

export async function verifyDocumentAction({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const documentId = formData.get('id') as string;
    const status = formData.get('status') as string;
    const notes = formData.get('notes') as string;
    
    if (!documentId) {
      throw new ValidationError('Document ID is required');
    }
    
    if (!status) {
      throw new ValidationError('Status is required');
    }
    
    // Validate status
    if (!APP_CONSTANTS.STATUSES.DOCUMENT.includes(status)) {
      throw new ValidationError('Invalid status');
    }
    
    // Verify document
    const document = await documentService.updateDocumentStatus(documentId, status, notes);
    
    return json({
      success: true,
      message: APP_CONSTANTS.SUCCESS_MESSAGES.DOCUMENT_VERIFIED,
      document,
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

export async function deleteDocumentAction({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const documentId = formData.get('id') as string;
    
    if (!documentId) {
      throw new ValidationError('Document ID is required');
    }
    
    // Delete document
    await documentService.deleteDocument(documentId);
    
    return json({
      success: true,
      message: 'Document deleted successfully',
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

export async function bulkVerifyDocumentsAction({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const documentIds = JSON.parse(formData.get('ids') as string) as string[];
    const status = formData.get('status') as string;
    const notes = formData.get('notes') as string;
    
    if (!documentIds || !Array.isArray(documentIds)) {
      throw new ValidationError('Document IDs are required');
    }
    
    if (!status) {
      throw new ValidationError('Status is required');
    }
    
    // Validate status
    if (!APP_CONSTANTS.STATUSES.DOCUMENT.includes(status)) {
      throw new ValidationError('Invalid status');
    }
    
    // Bulk verify documents
    const results = await Promise.allSettled(
      documentIds.map(id => documentService.updateDocumentStatus(id, status, notes))
    );
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;
    
    return json({
      success: true,
      message: `${successful} documents verified successfully`,
      successful,
      failed,
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

export async function generateMissingReportAction({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const employeeIds = formData.get('employeeIds') ? 
      JSON.parse(formData.get('employeeIds') as string) as string[] : 
      undefined;
    
    // Generate missing document report
    const report = await documentService.generateMissingReport(employeeIds);
    
    return json({
      success: true,
      message: 'Missing document report generated successfully',
      report,
    });
  } catch (error) {
    return json({
      success: false,
      message: APP_CONSTANTS.ERROR_MESSAGES.INTERNAL_ERROR,
    }, { status: 500 });
  }
}
