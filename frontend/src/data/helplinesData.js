/**
 * helplinesData.js
 * 
 * Purpose:
 * --------
 * This file provides a structured dataset of verified or government-issued 
 * emergency and support helpline numbers across India.
 * 
 * Structure:
 * ----------
 * Each object represents one helpline entry with the following fields:
 *  id: Unique identifier (number)
 *  name: Helpline title (string)
 *  number: Helpline contact number (string)
 *  category: Type of helpline (string)
 *  state: Applicable state or "All India" (string)
 *  description: Concise summary of the helpline’s purpose (string)
 * 
 * Usage:
 * ------
 * Import into components or pages to display categorized or searchable helpline data.
 * Example:
 *   import { helplinesData } from '../data/helplinesData';
 * 
 * Notes:
 * ------
 * - All numbers are string type for consistency.
 * - Categories include: National Helplines, Women’s Safety, Cybercrime & Fraud,
 *   Health & Mental Health, Disaster & Environment, Senior Citizens, Transport & Safety,
 *   Agriculture & Rural Support, and State-specific.
 */

export const helplinesData = [
  // ---------------- NATIONAL HELPLINES ----------------
  {
    id: 1,
    name: "All-in-One Emergency Number",
    number: "112",
    category: "National Helplines",
    state: "All India",
    description: "Unified emergency response number for police, fire, and ambulance across India."
  },
  {
    id: 2,
    name: "Police Helpline",
    number: "100",
    category: "National Helplines",
    state: "All India",
    description: "Direct line to police for any emergency or public safety issue."
  },
  {
    id: 3,
    name: "Fire & Rescue Service",
    number: "101",
    category: "National Helplines",
    state: "All India",
    description: "Report fire hazards or emergencies requiring immediate assistance."
  },
  {
    id: 4,
    name: "Ambulance Service",
    number: "102",
    category: "National Helplines",
    state: "All India",
    description: "Ambulance service for medical emergencies."
  },
  {
    id: 5,
    name: "Disaster Management",
    number: "108",
    category: "National Helplines",
    state: "All India",
    description: "Medical and disaster emergency helpline operating in multiple states."
  },
  {
    id: 6,
    name: "Child Helpline",
    number: "1098",
    category: "National Helplines",
    state: "All India",
    description: "Emergency support and protection service for children in distress."
  },
  {
    id: 7,
    name: "Railway Enquiry & Emergency",
    number: "139",
    category: "Transport & Safety",
    state: "All India",
    description: "Indian Railways passenger information and emergency helpline."
  },
  {
    id: 8,
    name: "Highway Accident Helpline (NHAI)",
    number: "1033",
    category: "Transport & Safety",
    state: "All India",
    description: "24×7 helpline for road accidents and breakdowns on national highways."
  },

  // ---------------- WOMEN’S SAFETY ----------------
  {
    id: 9,
    name: "Women Helpline (All India)",
    number: "1091",
    category: "Women’s Safety",
    state: "All India",
    description: "24×7 assistance for women facing harassment or distress."
  },
  {
    id: 10,
    name: "Domestic Violence Helpline",
    number: "181",
    category: "Women’s Safety",
    state: "All India",
    description: "National helpline for domestic violence complaints and counselling."
  },
  {
    id: 11,
    name: "UP Women Power Line",
    number: "1090",
    category: "Women’s Safety",
    state: "Uttar Pradesh",
    description: "Dedicated women’s safety and anti-harassment helpline."
  },
  {
    id: 12,
    name: "Delhi Women in Distress",
    number: "181",
    category: "Women’s Safety",
    state: "Delhi",
    description: "Women helpline by Delhi Government, operational 24×7."
  },

  // ---------------- CYBERCRIME & FRAUD ----------------
  {
    id: 13,
    name: "Cybercrime Helpline",
    number: "1930",
    category: "Cybercrime & Fraud",
    state: "All India",
    description: "National cybercrime reporting and online fraud helpline."
  },
  {
    id: 14,
    name: "National Cybercrime Reporting Portal",
    number: " ",//www.cybercrime.gov.in
    category: "Cybercrime & Fraud",
    state: "All India",
    description: "Official portal for reporting financial and cyber offences."
  },

  // ---------------- HEALTH & MENTAL HEALTH ----------------
  {
    id: 15,
    name: "AIDS Helpline",
    number: "1097",
    category: "Health & Mental Health",
    state: "All India",
    description: "24×7 HIV/AIDS counselling and information helpline."
  },
  {
    id: 16,
    name: "Mental Health Helpline (KIRAN)",
    number: "1800-599-0019",
    category: "Health & Mental Health",
    state: "All India",
    description: "National mental health rehabilitation helpline by NIMHANS."
  },
  {
    id: 17,
    name: "Tele-MANAS Mental Health Support",
    number: "14416",
    category: "Health & Mental Health",
    state: "All India",
    description: "Government initiative providing free tele-mental health counselling."
  },
  {
    id: 18,
    name: "COVID-19 Helpline (National)",
    number: "1075",
    category: "Health & Mental Health",
    state: "All India",
    description: "Ministry of Health helpline for COVID-19 related queries and emergencies."
  },

  // ---------------- DISASTER & ENVIRONMENT ----------------
  {
    id: 19,
    name: "Disaster Response (NDMA)",
    number: "011-1078",
    category: "Disaster & Environment",
    state: "All India",
    description: "National Disaster Management Authority emergency line."
  },
  {
    id: 20,
    name: "Forest Fire Helpline",
    number: "1926",
    category: "Disaster & Environment",
    state: "All India",
    description: "Emergency number to report forest fires and environmental hazards."
  },

  // ---------------- SENIOR CITIZEN & WELFARE ----------------
  {
    id: 21,
    name: "Senior Citizens Helpline",
    number: "14567",
    category: "Senior Citizens",
    state: "All India",
    description: "Elderline support for senior citizens’ welfare and emergencies."
  },
  {
    id: 22,
    name: "Child Rights & Protection (NCPCR)",
    number: "1800-121-2830",
    category: "Senior Citizens",
    state: "All India",
    description: "Helpline for reporting child rights violations and welfare concerns."
  },

  // ---------------- AGRICULTURE & RURAL SUPPORT ----------------
  {
    id: 23,
    name: "Kisan Call Center",
    number: "1800-180-1551",
    category: "Agriculture & Rural Support",
    state: "All India",
    description: "Advisory helpline for farmers on agriculture, weather, and government schemes."
  },
  {
    id: 24,
    name: "PM-KISAN Helpline",
    number: "155261",
    category: "Agriculture & Rural Support",
    state: "All India",
    description: "Helpline for PM Kisan Samman Nidhi Scheme beneficiaries."
  },

  // ---------------- STATE-SPECIFIC HELPLINES ----------------
  { id: 25, name: "Andhra Pradesh Health Helpline", number: "0866-2410978", category: "State-specific", state: "Andhra Pradesh", description: "Government health emergency helpline." },
  { id: 26, name: "Arunachal Pradesh Helpline", number: "1070", category: "State-specific", state: "Arunachal Pradesh", description: "Disaster management and emergency helpline." },
  { id: 27, name: "Assam Police Control Room", number: "0361-2524500", category: "State-specific", state: "Assam", description: "Police emergency contact for Assam." },
  { id: 28, name: "Bihar Women Helpline", number: "181", category: "State-specific", state: "Bihar", description: "Helpline for women’s safety and welfare." },
  { id: 29, name: "Chhattisgarh Health Helpline", number: "104", category: "State-specific", state: "Chhattisgarh", description: "State health and ambulance service number." },
  { id: 30, name: "Delhi Police Helpline", number: "100", category: "State-specific", state: "Delhi", description: "Delhi Police emergency control room." },
  { id: 31, name: "Goa Fire Control Room", number: "101", category: "State-specific", state: "Goa", description: "Emergency fire service contact for Goa." },
  { id: 32, name: "Gujarat COVID Helpline", number: "104", category: "State-specific", state: "Gujarat", description: "State helpline for COVID-19 and health emergencies." },
  { id: 33, name: "Haryana Health Helpline", number: "8558893911", category: "State-specific", state: "Haryana", description: "General health assistance helpline." },
  { id: 34, name: "Himachal Pradesh Disaster Helpline", number: "1070", category: "State-specific", state: "Himachal Pradesh", description: "Disaster management and emergency response line." },
  { id: 35, name: "Jharkhand Police Helpline", number: "100", category: "State-specific", state: "Jharkhand", description: "Emergency police control number." },
  { id: 36, name: "Karnataka Health Helpline", number: "104", category: "State-specific", state: "Karnataka", description: "State health helpline available 24×7." },
  { id: 37, name: "Kerala Disaster Management", number: "1077", category: "State-specific", state: "Kerala", description: "Disaster and flood control helpline." },
  { id: 38, name: "Madhya Pradesh CM Helpline", number: "181", category: "State-specific", state: "Madhya Pradesh", description: "Citizen grievance redressal and public service helpline." },
  { id: 39, name: "Maharashtra Health Helpline", number: "020-26127394", category: "State-specific", state: "Maharashtra", description: "Public health department helpline." },
  { id: 40, name: "Manipur Disaster Helpline", number: "0385-2440040", category: "State-specific", state: "Manipur", description: "Emergency contact for natural disasters." },
  { id: 41, name: "Meghalaya Police Helpline", number: "100", category: "State-specific", state: "Meghalaya", description: "Police emergency number." },
  { id: 42, name: "Mizoram Fire & Rescue", number: "101", category: "State-specific", state: "Mizoram", description: "Fire emergency control room number." },
  { id: 43, name: "Nagaland Health Helpline", number: "18003453750", category: "State-specific", state: "Nagaland", description: "State medical and health helpline." },
  { id: 44, name: "Odisha Health Helpline", number: "9439994859", category: "State-specific", state: "Odisha", description: "Official health helpline for Odisha citizens." },
  { id: 45, name: "Punjab Police Helpline", number: "181", category: "State-specific", state: "Punjab", description: "24×7 police emergency and support service." },
  { id: 46, name: "Rajasthan Women Helpline", number: "1090", category: "State-specific", state: "Rajasthan", description: "Women protection helpline run by the Rajasthan Police." },
  { id: 47, name: "Sikkim Emergency Control Room", number: "1070", category: "State-specific", state: "Sikkim", description: "State-level disaster control centre." },
  { id: 48, name: "Tamil Nadu Child Helpline", number: "1098", category: "State-specific", state: "Tamil Nadu", description: "Dedicated helpline for children in distress." },
  { id: 49, name: "Telangana Medical Helpline", number: "104", category: "State-specific", state: "Telangana", description: "Health department helpline for Telangana." },
  { id: 50, name: "West Bengal Disaster Helpline", number: "1070", category: "State-specific", state: "West Bengal", description: "Disaster response and emergency coordination helpline." }
];
