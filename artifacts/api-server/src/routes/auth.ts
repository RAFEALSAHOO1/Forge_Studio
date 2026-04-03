import { Router, type Request, type Response } from "express";
import { db } from "../db/connection";
import { usersTable, otpsTable } from "../db/schema";
import { eq, sql } from "drizzle-orm";
import { Resend } from "resend";
import * as crypto from "crypto";

const router = Router();
const resend = new Resend(process.env.RESEND_API_KEY);

// Country code and phone validation
const COUNTRY_CODES: Record<string, { name: string; code: string; pattern: RegExp }> = {
  "1": { name: "United States", code: "+1", pattern: /^\d{10}$/ },
  "44": { name: "United Kingdom", code: "+44", pattern: /^\d{10}$/ },
  "91": { name: "India", code: "+91", pattern: /^\d{10}$/ },
  "86": { name: "China", code: "+86", pattern: /^\d{11}$/ },
  "81": { name: "Japan", code: "+81", pattern: /^\d{10}$/ },
  "33": { name: "France", code: "+33", pattern: /^\d{9}$/ },
  "49": { name: "Germany", code: "+49", pattern: /^\d{10,11}$/ },
  "39": { name: "Italy", code: "+39", pattern: /^\d{10}$/ },
  "34": { name: "Spain", code: "+34", pattern: /^\d{9}$/ },
  "55": { name: "Brazil", code: "+55", pattern: /^\d{10,11}$/ },
  "61": { name: "Australia", code: "+61", pattern: /^\d{9}$/ },
  "64": { name: "New Zealand", code: "+64", pattern: /^\d{9}$/ },
  "27": { name: "South Africa", code: "+27", pattern: /^\d{9}$/ },
  "971": { name: "United Arab Emirates", code: "+971", pattern: /^\d{9}$/ },
  "966": { name: "Saudi Arabia", code: "+966", pattern: /^\d{9}$/ },
  "852": { name: "Hong Kong", code: "+852", pattern: /^\d{8}$/ },
  "65": { name: "Singapore", code: "+65", pattern: /^\d{8}$/ },
  "60": { name: "Malaysia", code: "+60", pattern: /^\d{9,10}$/ },
  "62": { name: "Indonesia", code: "+62", pattern: /^\d{9,12}$/ },
  "66": { name: "Thailand", code: "+66", pattern: /^\d{9}$/ },
  "84": { name: "Vietnam", code: "+84", pattern: /^\d{9,10}$/ },
  "63": { name: "Philippines", code: "+63", pattern: /^\d{10}$/ },
  "82": { name: "South Korea", code: "+82", pattern: /^\d{9,10}$/ },
  "90": { name: "Turkey", code: "+90", pattern: /^\d{10}$/ },
  "98": { name: "Iran", code: "+98", pattern: /^\d{10}$/ },
  "212": { name: "Morocco", code: "+212", pattern: /^\d{9}$/ },
  "20": { name: "Egypt", code: "+20", pattern: /^\d{10}$/ },
  "234": { name: "Nigeria", code: "+234", pattern: /^\d{10}$/ },
  "254": { name: "Kenya", code: "+254", pattern: /^\d{9}$/ },
  "256": { name: "Uganda", code: "+256", pattern: /^\d{9}$/ },
  "255": { name: "Tanzania", code: "+255", pattern: /^\d{9}$/ },
  "57": { name: "Colombia", code: "+57", pattern: /^\d{10}$/ },
  "56": { name: "Chile", code: "+56", pattern: /^\d{9}$/ },
  "54": { name: "Argentina", code: "+54", pattern: /^\d{10}$/ },
  "51": { name: "Peru", code: "+51", pattern: /^\d{9}$/ },
  "58": { name: "Venezuela", code: "+58", pattern: /^\d{10}$/ },
  "505": { name: "Nicaragua", code: "+505", pattern: /^\d{8}$/ },
  "502": { name: "Guatemala", code: "+502", pattern: /^\d{8}$/ },
  "503": { name: "El Salvador", code: "+503", pattern: /^\d{8}$/ },
  "504": { name: "Honduras", code: "+504", pattern: /^\d{8}$/ },
  "506": { name: "Costa Rica", code: "+506", pattern: /^\d{8}$/ },
  "507": { name: "Panama", code: "+507", pattern: /^\d{8}$/ },
  "1876": { name: "Jamaica", code: "+1876", pattern: /^\d{7}$/ },
  "1809": { name: "Dominican Republic", code: "+1809", pattern: /^\d{7}$/ },
  "1242": { name: "Bahamas", code: "+1242", pattern: /^\d{7}$/ },
  "45": { name: "Denmark", code: "+45", pattern: /^\d{8}$/ },
  "46": { name: "Sweden", code: "+46", pattern: /^\d{9}$/ },
  "47": { name: "Norway", code: "+47", pattern: /^\d{8}$/ },
  "358": { name: "Finland", code: "+358", pattern: /^\d{9}$/ },
  "31": { name: "Netherlands", code: "+31", pattern: /^\d{9}$/ },
  "32": { name: "Belgium", code: "+32", pattern: /^\d{9}$/ },
  "41": { name: "Switzerland", code: "+41", pattern: /^\d{9}$/ },
  "43": { name: "Austria", code: "+43", pattern: /^\d{9,10}$/ },
  "48": { name: "Poland", code: "+48", pattern: /^\d{9}$/ },
  "420": { name: "Czech Republic", code: "+420", pattern: /^\d{9}$/ },
  "421": { name: "Slovakia", code: "+421", pattern: /^\d{9}$/ },
  "36": { name: "Hungary", code: "+36", pattern: /^\d{9}$/ },
  "40": { name: "Romania", code: "+40", pattern: /^\d{9}$/ },
  "359": { name: "Bulgaria", code: "+359", pattern: /^\d{9}$/ },
  "30": { name: "Greece", code: "+30", pattern: /^\d{10}$/ },
  "385": { name: "Croatia", code: "+385", pattern: /^\d{9}$/ },
  "381": { name: "Serbia", code: "+381", pattern: /^\d{9,10}$/ },
  "387": { name: "Bosnia and Herzegovina", code: "+387", pattern: /^\d{8}$/ },
  "383": { name: "Kosovo", code: "+383", pattern: /^\d{8}$/ },
  "389": { name: "Macedonia", code: "+389", pattern: /^\d{8}$/ },
  "355": { name: "Albania", code: "+355", pattern: /^\d{9}$/ },
  "375": { name: "Belarus", code: "+375", pattern: /^\d{9}$/ },
  "380": { name: "Ukraine", code: "+380", pattern: /^\d{9}$/ },
  "7": { name: "Russia", code: "+7", pattern: /^\d{10}$/ },
  "370": { name: "Lithuania", code: "+370", pattern: /^\d{8}$/ },
  "371": { name: "Latvia", code: "+371", pattern: /^\d{8}$/ },
  "372": { name: "Estonia", code: "+372", pattern: /^\d{7}$/ },
  "353": { name: "Ireland", code: "+353", pattern: /^\d{9}$/ },
  "676": { name: "Tonga", code: "+676", pattern: /^\d{5}$/ },
  "679": { name: "Fiji", code: "+679", pattern: /^\d{7}$/ },
  "672": { name: "Norfolk Island", code: "+672", pattern: /^\d{5}$/ },
  "1671": { name: "Guam", code: "+1671", pattern: /^\d{7}$/ },
  "1670": { name: "Northern Mariana Islands", code: "+1670", pattern: /^\d{7}$/ },
  "1684": { name: "American Samoa", code: "+1684", pattern: /^\d{7}$/ },
  "688": { name: "Tuvalu", code: "+688", pattern: /^\d{5}$/ },
  "686": { name: "Kiribati", code: "+686", pattern: /^\d{5}$/ },
  "685": { name: "Samoa", code: "+685", pattern: /^\d{5,7}$/ },
  "690": { name: "Tokelau", code: "+690", pattern: /^\d{4}$/ },
  "691": { name: "Micronesia", code: "+691", pattern: /^\d{7}$/ },
  "692": { name: "Marshall Islands", code: "+692", pattern: /^\d{7}$/ },
  "680": { name: "Palau", code: "+680", pattern: /^\d{7}$/ },
  "1787": { name: "Puerto Rico", code: "+1787", pattern: /^\d{7}$/ },
  "1939": { name: "Puerto Rico", code: "+1939", pattern: /^\d{7}$/ },
  "1868": { name: "Trinidad and Tobago", code: "+1868", pattern: /^\d{7}$/ },
  "1246": { name: "Barbados", code: "+1246", pattern: /^\d{7}$/ },
  "1758": { name: "St. Lucia", code: "+1758", pattern: /^\d{7}$/ },
  "1784": { name: "St. Vincent", code: "+1784", pattern: /^\d{7}$/ },
  "1473": { name: "Grenada", code: "+1473", pattern: /^\d{7}$/ },
  "1649": { name: "Turks and Caicos", code: "+1649", pattern: /^\d{7}$/ },
  "1441": { name: "Bermuda", code: "+1441", pattern: /^\d{7}$/ },
  "1264": { name: "Anguilla", code: "+1264", pattern: /^\d{7}$/ },
  "1268": { name: "Antigua and Barbuda", code: "+1268", pattern: /^\d{7}$/ },
  "1869": { name: "St. Kitts and Nevis", code: "+1869", pattern: /^\d{7}$/ },
  "1664": { name: "Montserrat", code: "+1664", pattern: /^\d{7}$/ },
  "1767": { name: "Dominica", code: "+1767", pattern: /^\d{7}$/ },
};

// Generate OTP code
function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP email
async function sendOTPEmail(email: string, otp: string): Promise<void> {
  try {
    await resend.emails.send({
      from: "auth@forge-studio.dev",
      to: email,
      subject: "Your Forge Studio Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h1>Verification Code</h1>
          <p>Your OTP code is:</p>
          <h2 style="color: #6366f1; letter-spacing: 2px;">${otp}</h2>
          <p>This code expires in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}

// Send OTP SMS (using a service like Twilio would go here)
async function sendOTPSMS(phoneNumber: string, countryCode: string, otp: string): Promise<void> {
  // This would integrate with a service like Twilio
  console.log(`SMS OTP for ${countryCode}${phoneNumber}: ${otp}`);
  // For now, we'll just log it
}

// Generate country list endpoint
router.get("/countries", (req: Request, res: Response) => {
  const countries = Object.entries(COUNTRY_CODES).map(([code, data]) => ({
    code,
    name: data.name,
    pattern: data.pattern,
    codeDisplay: data.code,
  }));
  res.json(countries);
});

// Request OTP - Email
router.post("/request-otp-email", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Valid email required" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this email
    await db.delete(otpsTable).where(eq(otpsTable.email, email));

    // Create new OTP
    await db.insert(otpsTable).values({
      email,
      otpCode: otp,
      expiresAt,
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    return res.json({ message: "OTP sent to email", expiresIn: 600 });
  } catch (error) {
    console.error("OTP request error:", error);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Request OTP - Phone
router.post("/request-otp-phone", async (req: Request, res: Response) => {
  try {
    const { phoneNumber, countryCode } = req.body;

    if (!countryCode || !COUNTRY_CODES[countryCode]) {
      return res.status(400).json({ error: "Invalid country code" });
    }

    const pattern = COUNTRY_CODES[countryCode].pattern;
    if (!pattern.test(phoneNumber)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete any existing OTPs for this phone
    await db
      .delete(otpsTable)
      .where(
        sql`${otpsTable.phoneNumber} = ${phoneNumber} AND ${otpsTable.countryCode} = ${countryCode}`,
      );

    // Create new OTP
    await db.insert(otpsTable).values({
      phoneNumber,
      countryCode,
      otpCode: otp,
      expiresAt,
    });

    // Send OTP SMS
    await sendOTPSMS(phoneNumber, COUNTRY_CODES[countryCode].code, otp);

    return res.json({ message: "OTP sent to phone", expiresIn: 600 });
  } catch (error) {
    console.error("OTP request error:", error);
    return res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Verify OTP
router.post("/verify-otp", async (req: Request, res: Response) => {
  try {
    const { otpCode, email, phoneNumber, countryCode } = req.body;

    let otpRecord;

    if (email) {
      otpRecord = await db.query.otpsTable.findFirst({
        where: eq(otpsTable.email, email),
      });
    } else if (phoneNumber && countryCode) {
      otpRecord = await db.query.otpsTable.findFirst({
        where: sql`${otpsTable.phoneNumber} = ${phoneNumber} AND ${otpsTable.countryCode} = ${countryCode}`,
      });
    } else {
      return res.status(400).json({ error: "Email or phone number required" });
    }

    if (!otpRecord) {
      return res.status(404).json({ error: "OTP not found or expired" });
    }

    if (otpRecord.isVerified) {
      return res.status(400).json({ error: "OTP already verified" });
    }

    if ((otpRecord.attempts ?? 0) >= (otpRecord.maxAttempts ?? 5)) {
      return res.status(429).json({ error: "Too many failed attempts" });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({ error: "OTP expired" });
    }

    if (otpRecord.otpCode !== otpCode) {
      // Increment attempts
      await db
        .update(otpsTable)
        .set({ attempts: (otpRecord.attempts ?? 0) + 1 })
        .where(eq(otpsTable.id, otpRecord.id));
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // Mark OTP as verified
    await db.update(otpsTable).set({ isVerified: true }).where(eq(otpsTable.id, otpRecord.id));

    return res.json({ verified: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ error: "Failed to verify OTP" });
  }
});

export default router;
