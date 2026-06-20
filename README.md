# Promtal Jobs - Advanced Applicant Tracking System (ATS)

![Promtal Banner](https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2850)

Promtal Jobs is a modern, full-stack Applicant Tracking System designed to bridge the gap between talented candidates and growing companies. Built with cutting-edge technologies, it streamlines the hiring process by offering intelligent resume matching, automated offer letter generation, and real-time dashboard analytics.

---

## 🌟 Core Features

### For Candidates
- **Dynamic Dashboard**: Track applications, scheduled interviews, and received offer letters in real-time.
- **Smart Resume Uploads**: Easily upload resumes which are parsed and matched against job requirements.
- **Progress Tracking**: See transparent status updates and AI match scores for every application.

### For Recruiters
- **Application Management**: Intuitive Kan-ban style lists to Shortlist, Reject, or place candidates On Hold.
- **AI-Powered Match Scores**: Instantly see how well a candidate's skills align with the job requirements.
- **One-Click Generation**: Automatically generate formatted Offer Letters and Experience Letters as downloadable PDFs.
- **Automated Communication**: Seamlessly trigger status update emails via Resend and instant notifications via Telegram.

### For Admins
- **Global Analytics**: Comprehensive view of total users, companies, jobs, and system health.
- **Interactive KPI Cards**: Clickable animated statistic cards that open detailed sliding drawers.
- **Live Search & Filters**: Instantly search through companies, users, and applications across the platform.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & Lucide Icons
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + GoTrue Auth)
- **PDF Generation**: `jspdf` & `jspdf-autotable`
- **Email Service**: [Resend](https://resend.com/)

---

## 🚀 Installation & Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/promtal.git
   cd promtal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   RESEND_API_KEY=your_resend_api_key
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_CHAT_ID=your_telegram_chat_id
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🧪 Demo Credentials

To experience the platform seamlessly, you can use the following demo accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@promtal.demo | Demo@123 |
| **Recruiter** | recruiter@promtal.demo | Demo@123 |
| **Candidate** | candidate@promtal.demo | Demo@123 |

*(Note: These accounts are prepopulated in the live deployment environment to ensure frictionless testing for judges and reviewers.)*

---

## ☁️ Live Demo & Deployment

The platform is officially deployed on Vercel and seamlessly integrated with Supabase.

**Live URL**: [Insert Live URL Here]

To deploy your own instance to Vercel:
1. Push your code to a GitHub repository.
2. Go to [Vercel](https://vercel.com/) and Import your repository.
3. Paste the variables from `.env.local` into the Vercel Environment Variables configuration.
4. Click **Deploy**.

---
*Built with passion by Bhargav for the ultimate recruiting experience.*
