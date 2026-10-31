import { Enquiry } from '@/types/enquiry.types';

export const INITIAL_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-01',
    name: 'Rajeshwer Rao',
    email: 'r.rao@apexholding.com',
    phone: '+91 99880 77665',
    projectType: 'Turnkey Villa Interior',
    budgetRange: '₹1.5 Cr - ₹3 Cr',
    message: 'We are completing civil construction on a 7,500 sq.ft villa in Kokapet, Hyderabad. We are looking for a complete turnkey interior architecture team for end-to-end design and execution.',
    status: 'new',
    createdAt: '2026-10-30T14:20:00.000Z'
  },
  {
    id: 'enq-02',
    name: 'Pooja Kashyap',
    email: 'pooja.k@studioverve.in',
    phone: '+91 98201 44556',
    projectType: 'Commercial Workplace',
    budgetRange: '₹75 Lakhs - ₹1.5 Cr',
    message: 'Seeking interior design and acoustic panelling for our new 5,000 sq.ft venture studio in Indiranagar, Bengaluru. Would love to schedule a preliminary consultation.',
    status: 'contacted',
    createdAt: '2026-10-28T11:15:00.000Z',
    notes: 'Called client on Oct 29. Scheduled introductory Zoom presentation.'
  }
];

