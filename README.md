# Promptal Hiring Solutions

Promptal is a next-generation AI-powered hiring platform designed to bridge the gap between talented candidates and top-tier recruiters. With dedicated, seamless workflows for Administrators, Recruiters, and Candidates, Promptal streamlines the entire recruitment lifecycle—from job posting and AI resume parsing to automated interview scheduling and offer letter generation.

## 🌟 Demo Accounts

You can test the different role-based dashboards using the following demo accounts:

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@test.com | `12345678` |
| **Recruiter** | recruiter@test.com | `12345678` |
| **Candidate** | candidate@test.com | `12345678` |

---

## 🚀 Key Features

### 1. Unified Authentication & Role-Based Access Control (RBAC)
- Secure Login/Signup powered by Supabase Auth.
- Automatic routing based on user roles (Admin, Recruiter, Candidate).
- Protected routes ensuring users can only access data authorized for their role.

### 2. Candidate Experience
- **Smart Profile Management**: Upload a PDF resume, and our integrated AI parser automatically extracts Skills, Education, and Experience.
- **Job Applications Track**: Browse the public Jobs Board, apply to jobs with a single click, and track your application status (Applied, Shortlisted, Selected, Rejected).
- **Interview Hub**: View scheduled interviews complete with date, time, and dynamic Join links for Google Meet, Zoom, or MS Teams.
- **Offer Letters**: Receive and securely view customized, professionally formatted offer letters directly in the dashboard.
- **Profile Analytics**: Get visual feedback on Profile Completion percentage.

### 3. Recruiter Tools
- **Company Profile**: Manage the hiring company’s public profile and branding.
- **Job Posting**: Create, edit, and manage job listings instantly visible on the public Jobs Board.
- **Application Management**: View all candidates who applied for your listings. Accept, Shortlist, or Reject candidates seamlessly.
- **AI Match Scoring**: Automatically view an AI-generated match score determining how closely a candidate's resume aligns with the job description.
- **Interview Scheduling**: Schedule interviews directly from the dashboard. Specify the platform (Zoom, Google Meet, MS Teams) and meeting links, which automatically synchronize to the candidate's dashboard.
- **Offer Letter Generation**: Generate standardized offer letters for selected candidates with just a few clicks.

### 4. Administrator Control Center
- **Birds-Eye View Analytics**: Monitor total platform users, active companies, posted jobs, and total applications at a glance.
- **Slide-Out Management Panels**: Deep dive into platform data via sleek, animated slide-out panels. 
  - View all Companies registered.
  - View all Jobs posted.
  - View all Users on the platform.
  - View detailed Application metrics (cross-referencing Candidate Names, Job Roles, and AI Scores).
  - Track generated Offer Letters.
- **Real-time Search & Filtering**: Instantly search across huge datasets within the Admin slide-out panels.

### 5. Public Jobs Board
- Fully searchable public job directory available to logged-out users.
- Advanced filtering capabilities by search terms, location, and job type.

### 6. Premium UI & Fully Adaptive Dark Mode
- Built using **Tailwind CSS** with a stunning, modern glassmorphic aesthetic.
- **Flawless Dark Mode Support**: Every single page, dashboard, modal, badge, and input field seamlessly adapts to an eye-friendly, premium dark mode palette (`Slate 800/900`, `Emerald`, etc.).
- Animated transitions and micro-interactions powered by **Framer Motion / Motion for React**.
- Beautiful iconography via **Lucide React**.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, CSS Modules
- **Backend as a Service**: Supabase (PostgreSQL Database, Authentication, Edge Functions, Storage)
- **PDF Parsing**: pdf.js (Client-side Resume extraction)
- **Animations**: Motion for React
- **Notifications**: React Hot Toast

---

## 💻 Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/bhavya1919/Promptal.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local` (Requires Supabase URL and Anon Key):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.
