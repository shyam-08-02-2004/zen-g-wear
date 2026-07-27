import fs from 'fs';
import path from 'path';

const filesToUpdate = [
  'src/pages/admin/AdminDashboardOverview.jsx',
  'src/pages/admin/AdminOrdersPage.jsx',
  'src/pages/admin/AdminPaymentsPage.jsx',
  'src/pages/admin/AdminProductsPage.jsx',
  'src/pages/admin/AdminRevenuePage.jsx',
  'src/pages/dashboard/BillingPage.jsx',
  'src/pages/dashboard/DashboardOverview.jsx',
  'src/pages/dashboard/InvoicesPage.jsx',
  'src/pages/dashboard/OrdersPage.jsx',
  'src/pages/shop/CartPage.jsx',
  'src/pages/shop/CheckoutPage.jsx',
  'src/pages/shop/ProductDetails.jsx',
  'src/pages/shop/ProductListing.jsx',
  'src/components/sections/PricingSection.jsx'
];

filesToUpdate.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace JSX text like >${val} with >Rs {val}
    content = content.replace(/>\$\{/g, '>Rs {');
    // Replace JSX text like >$5.00< with >Rs 5.00<
    content = content.replace(/>\$([0-9]+(?:\.[0-9]+)?)</g, '>Rs $1<');
    
    // Replace template strings like `$${val}` with `Rs ${val}`
    content = content.replace(/`\$\$\{/g, '`Rs ${');
    
    // Replace exact template strings like `[$${val}]` (e.g. tooltip formatter)
    content = content.replace(/\[`\$\$\{/g, '[`Rs ${');
    
    // Replace $79/month in PricingSection or Billing
    content = content.replace(/\$([0-9]+)\/month/g, 'Rs $1/month');
    
    // Replace exact price: '$29.99' to price: 'Rs 29.99'
    content = content.replace(/'\$([0-9]+\.[0-9]+)'/g, "'Rs $1'");

    // Replace <span ...>${val}</span>
    content = content.replace(/>\$\{([a-zA-Z0-9_.\(\)]+)\}/g, '>Rs {$1}');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`File not found: ${file}`);
  }
});
