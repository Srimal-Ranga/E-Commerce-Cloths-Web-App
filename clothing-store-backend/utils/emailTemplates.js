exports.orderConfirmationEmail = (order, user) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        ${item.name}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.size}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${item.price.toFixed(2)}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
        <h1 style="color: #2c3e50; margin: 0;">Order Confirmation</h1>
      </div>
      
      <p>Hi ${user.name},</p>
      
      <p>Thank you for your order! We're excited to get your items to you.</p>
      
      <div style="background: #fff; border: 2px solid #e9ecef; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <h2 style="color: #495057; margin-top: 0;">Order Details</h2>
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background: #f8f9fa;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #dee2e6;">Product</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Size</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #dee2e6;">Qty</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Price</th>
            <th style="padding: 10px; text-align: right; border-bottom: 2px solid #dee2e6;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px;">
              Total:
            </td>
            <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #28a745;">
              $${order.totalPrice.toFixed(2)}
            </td>
          </tr>
        </tfoot>
      </table>
      
      <div style="background: #e7f3ff; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0;">
        <p style="margin: 0;"><strong>What's next?</strong></p>
        <p style="margin: 5px 0 0 0;">We'll send you another email once your order has shipped with tracking information.</p>
      </div>
      
      <p>If you have any questions about your order, please don't hesitate to contact us.</p>
      
      <p>Best regards,<br>
      <strong>Clothing Store Team</strong></p>
      
      <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
      
      <p style="font-size: 12px; color: #6c757d; text-align: center;">
        This is an automated email. Please do not reply to this message.
      </p>
    </body>
    </html>
  `;
};