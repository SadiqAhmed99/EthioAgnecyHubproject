import { json, type ActionFunctionArgs } from '@remix-run/node';
import { requireUser } from '~/middleware/authMiddleware.server';
import { prisma } from '~/lib/prisma.server';
import { ValidationError } from '~/middleware/errorMiddleware.server';
import { APP_CONSTANTS } from '~/config/constants';

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  
  try {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    
    if (!email) {
      throw new ValidationError('Email is required');
    }
    
    // Validate email format
    if (!APP_CONSTANTS.VALIDATION.EMAIL_REGEX.test(email)) {
      throw new ValidationError('Invalid email format');
    }
    
    // Check if email exists in employees
    const existingEmployee = await prisma.employee.findUnique({
      where: { email },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
    
    // Check if email exists in users
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
    
    const isAvailable = !existingEmployee && !existingUser;
    
    return json({
      success: true,
      email,
      available: isAvailable,
      message: isAvailable 
        ? 'Email is available' 
        : 'Email is already registered',
      existingRecord: existingEmployee || existingUser,
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
