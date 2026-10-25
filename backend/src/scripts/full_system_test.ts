const API_BASE = 'http://127.0.0.1:5000/api';
const AI_BASE = 'http://127.0.0.1:8000/api/v1';

interface TestResult {
  category: string;
  name: string;
  status: 'PASS' | 'FAIL';
  detail?: string;
  durationMs: number;
}

const results: TestResult[] = [];

async function testStep(category: string, name: string, fn: () => Promise<string | void>) {
  const start = Date.now();
  try {
    const detail = (await fn()) || 'OK';
    results.push({ category, name, status: 'PASS', detail, durationMs: Date.now() - start });
    console.log(`  [PASS] ${category} -> ${name} (${Date.now() - start}ms): ${detail}`);
  } catch (err: any) {
    results.push({ category, name, status: 'FAIL', detail: err.message, durationMs: Date.now() - start });
    console.error(`  [FAIL] ${category} -> ${name} (${Date.now() - start}ms): ${err.message}`);
  }
}

async function runAllTests() {
  console.log('\n=============================================================');
  console.log('  CAMPUSCONNECT FULL SYSTEM COMPREHENSIVE VERIFICATION SUITE  ');
  console.log('=============================================================\n');

  let studentToken = '';
  let recruiterToken = '';
  let officerToken = '';
  let alumniToken = '';
  let studentUserId = '';
  let alumniUserId = '';
  let testJobId = '';
  let testApplicationId = '';
  let testDriveId = '';
  let testEventId = '';
  let testNotificationId = '';

  // 1. PUBLIC ENDPOINTS
  console.log('\n--- 1. Testing Public Endpoints ---');
  await testStep('Public', 'Backend Health Check', async () => {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'healthy') throw new Error('Unhealthy status');
    return `Status: ${data.status}, Uptime: ${data.uptimeSeconds}s`;
  });

  await testStep('Public', 'Job Listings with Pagination', async () => {
    const res = await fetch(`${API_BASE}/students/jobs?page=1&limit=5`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data.jobs)) throw new Error('Invalid jobs response');
    if (data.data.jobs.length > 0) testJobId = data.data.jobs[0]._id;
    return `Found ${data.data.jobs.length} jobs, Total: ${data.data.total}`;
  });

  await testStep('Public', 'Job Filtering by Department & Search', async () => {
    const res = await fetch(`${API_BASE}/students/jobs?department=Computer%20Science%20and%20Engineering&search=Engineer`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success) throw new Error('Filter query failed');
    return `Filtered query returned ${data.data.jobs.length} matching jobs`;
  });

  await testStep('Public', 'Alumni Directory Search', async () => {
    const res = await fetch(`${API_BASE}/alumni/directory`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const profiles = data.data?.profiles;
    if (!Array.isArray(profiles)) throw new Error('Invalid profiles format');
    if (profiles.length > 0) {
      alumniUserId = profiles[0].user?._id || profiles[0].user;
    }
    return `Found ${profiles.length} alumni in public directory`;
  });

  await testStep('Public', 'Alumni Public Events/Workshops', async () => {
    const res = await fetch(`${API_BASE}/alumni/events`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const events = data.data;
    if (!Array.isArray(events)) throw new Error('Invalid events format');
    if (events.length > 0) testEventId = events[0]._id;
    return `Found ${events.length} upcoming campus events`;
  });

  // 2. AUTHENTICATION & RBAC
  console.log('\n--- 2. Testing Authentication & RBAC ---');
  await testStep('Auth', 'Security Safeguard: Block Public Officer Registration', async () => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Malicious Admin',
        email: `hacker_${Date.now()}@admin.com`,
        password: 'Password@123',
        role: 'placement_officer',
      }),
    });
    if (res.status !== 403) throw new Error(`Expected 403 Forbidden, got ${res.status}`);
    const data = await res.json();
    if (data.success) throw new Error('Registration should have been rejected');
    return 'Correctly returned 403 Forbidden';
  });

  await testStep('Auth', 'New Student Registration', async () => {
    const uniqueEmail = `student.test.${Date.now()}@campus.edu`;
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New Registered Student',
        email: uniqueEmail,
        password: 'Password@123',
        role: 'student',
        department: 'Information Technology',
        rollNumber: `IT-${Date.now().toString().slice(-5)}`,
        graduationYear: 2025,
        cgpa: 8.8,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.data.accessToken) throw new Error('Missing token');
    return `Registered ID: ${data.data.user.id}, Role: ${data.data.user.role}`;
  });

  await testStep('Auth', 'Login as Seeded Placement Officer (Admin)', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@campusconnect.edu', password: 'Password@123' }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    officerToken = data.data.accessToken;
    if (data.data.user.role !== 'placement_officer') throw new Error('Wrong role');
    return `Authenticated: ${data.data.user.name} (${data.data.user.role})`;
  });

  await testStep('Auth', 'Login as Seeded Recruiter', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'recruiter.msft@microsoft.com', password: 'Password@123' }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    recruiterToken = data.data.accessToken;
    if (data.data.user.role !== 'recruiter') throw new Error('Wrong role');
    return `Authenticated: ${data.data.user.name} (${data.data.user.role})`;
  });

  await testStep('Auth', 'Login as Seeded Student', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'rahul.sharma@student.iiite.ac.in', password: 'Password@123' }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    studentToken = data.data.accessToken;
    studentUserId = data.data.user.id;
    if (data.data.user.role !== 'student') throw new Error('Wrong role');
    return `Authenticated: ${data.data.user.name} (${data.data.user.role})`;
  });

  await testStep('Auth', 'Login as Seeded Alumni', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'alumni.amit@gmail.com', password: 'Password@123' }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    alumniToken = data.data.accessToken;
    if (data.data.user.role !== 'alumni') throw new Error('Wrong role');
    return `Authenticated: ${data.data.user.name} (${data.data.user.role})`;
  });

  await testStep('Auth', 'Fetch Authenticated Session Profile (/api/auth/me)', async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.data.user.email !== 'rahul.sharma@student.iiite.ac.in') throw new Error('Mismatch user');
    return `Verified session user: ${data.data.user.name}`;
  });

  // 3. STUDENT PORTAL WORKFLOWS
  console.log('\n--- 3. Testing Student Portal Workflows ---');
  await testStep('Student', 'Get Student Profile Details', async () => {
    const res = await fetch(`${API_BASE}/students/profile`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const p = data.data;
    return `CGPA: ${p.cgpa}, Skills: ${p.skills.join(', ')}`;
  });

  await testStep('Student', 'Update Student Profile', async () => {
    const res = await fetch(`${API_BASE}/students/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        bio: 'Passionate developer interested in distributed cloud systems & AI.',
        skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Python', 'FastAPI'],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return `Updated bio and ${data.data.skills.length} skills`;
  });

  await testStep('Student', 'Upload Resume PDF Mock', async () => {
    const boundary = '----WebKitFormBoundaryTest' + Date.now();
    const pdfContent = '%PDF-1.4\n1 0 obj\n<< /Title (Test Resume) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF';
    
    const body = 
      `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="resume"; filename="Rahul_Resume_Test.pdf"\r\n` +
      `Content-Type: application/pdf\r\n\r\n` +
      `${pdfContent}\r\n` +
      `--${boundary}--\r\n`;

    const res = await fetch(`${API_BASE}/students/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        Authorization: `Bearer ${studentToken}`,
      },
      body: Buffer.from(body),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return `Uploaded: ${data.data.resumeOriginalName} -> ${data.data.resumeUrl}`;
  });

  await testStep('Student', 'AI Job Recommendations with Microservice', async () => {
    const res = await fetch(`${API_BASE}/students/recommendations`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data.recommendations)) throw new Error('Invalid recommendations');
    const count = data.data.recommendations.length;
    const top = data.data.recommendations[0];
    return `Returned ${count} jobs, top match score: ${top ? top.matchScore + '%' : 'N/A'}`;
  });

  await testStep('Student', 'Apply for Open Job', async () => {
    const res = await fetch(`${API_BASE}/students/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        jobId: testJobId,
        coverNote: 'I am excited to apply for this role and contribute to the team.',
      }),
    });
    const data = await res.json();
    if (res.status === 201) {
      testApplicationId = data.data._id;
      return `Created application ID: ${testApplicationId}`;
    } else if (res.status === 409) {
      return `Already applied (Duplicate protected as expected)`;
    } else {
      throw new Error(`HTTP ${res.status}: ${data.message}`);
    }
  });

  await testStep('Student', 'Duplicate Application Prevention Check', async () => {
    const res = await fetch(`${API_BASE}/students/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        jobId: testJobId,
        coverNote: 'Trying to apply again duplicate',
      }),
    });
    if (res.status !== 409) throw new Error(`Expected 409 Conflict, got ${res.status}`);
    return 'Correctly returned 409 Conflict (Duplicate prevented)';
  });

  await testStep('Student', 'View Student Application History', async () => {
    const res = await fetch(`${API_BASE}/students/applications`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const apps = data.data;
    if (!Array.isArray(apps)) throw new Error('Expected array of applications');
    if (apps.length > 0 && !testApplicationId) {
      testApplicationId = apps[0]._id;
    }
    return `Found ${apps.length} submitted applications`;
  });

  // 4. RECRUITER PORTAL WORKFLOWS
  console.log('\n--- 4. Testing Recruiter Portal Workflows ---');
  await testStep('Recruiter', 'Get Recruiter Company Profile', async () => {
    const res = await fetch(`${API_BASE}/recruiters/company`, {
      headers: { Authorization: `Bearer ${recruiterToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return `Company: ${data.data?.name || 'Microsoft India'}`;
  });

  let createdJobId = '';
  await testStep('Recruiter', 'Post New Job Opening', async () => {
    const res = await fetch(`${API_BASE}/recruiters/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${recruiterToken}`,
      },
      body: JSON.stringify({
        title: 'Cloud Systems Engineer',
        description: 'Design and deploy scalable microservices using TypeScript, Node.js, and Docker.',
        jobType: 'full_time',
        workplaceType: 'hybrid',
        location: 'Hyderabad, India',
        salaryMin: 1800000,
        salaryMax: 2400000,
        requiredSkills: ['Node.js', 'TypeScript', 'MongoDB'],
        preferredSkills: ['Docker', 'AWS'],
        eligibleDepartments: ['Computer Science and Engineering', 'Information Technology'],
        minCgpa: 7.5,
        targetGraduationYears: [2025, 2026],
        positions: 5,
        deadline: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
        status: 'active',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    createdJobId = data.data._id;
    return `Created job: "${data.data.title}" (ID: ${createdJobId})`;
  });

  await testStep('Recruiter', 'View Recruiter Job Postings', async () => {
    const res = await fetch(`${API_BASE}/recruiters/jobs`, {
      headers: { Authorization: `Bearer ${recruiterToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return `Total active jobs posted: ${data.data.length}`;
  });

  await testStep('Recruiter', 'View Applicants for Job', async () => {
    const res = await fetch(`${API_BASE}/recruiters/jobs/${createdJobId}/applicants`, {
      headers: { Authorization: `Bearer ${recruiterToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const apps = data.data.applicants;
    if (apps && apps.length > 0) {
      testApplicationId = apps[0]._id;
    }
    return `Found ${apps ? apps.length : 0} applicants for Job ${createdJobId}`;
  });

  // Student applies to the recruiter's created job
  await testStep('Student', 'Student Applies to Recruiter Job', async () => {
    const res = await fetch(`${API_BASE}/students/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${studentToken}`,
      },
      body: JSON.stringify({
        jobId: createdJobId,
        coverNote: 'Excited to apply for this Cloud Systems Engineer role.',
      }),
    });
    if (!res.ok && res.status !== 409) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    testApplicationId = data.data?._id || testApplicationId;
    return `Applied to created job (App ID: ${testApplicationId})`;
  });

  await testStep('Recruiter', 'Update Application Status to Shortlisted', async () => {
    const res = await fetch(`${API_BASE}/recruiters/applicants/${testApplicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${recruiterToken}`,
      },
      body: JSON.stringify({
        status: 'shortlisted',
        note: 'Strong technical profile matching core requirements.',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return `Updated status to: ${data.data.status}`;
  });

  await testStep('Recruiter', 'Schedule Technical Interview', async () => {
    const res = await fetch(`${API_BASE}/recruiters/interviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${recruiterToken}`,
      },
      body: JSON.stringify({
        applicationId: testApplicationId,
        round: 1,
        roundName: 'Technical Architecture Round',
        scheduledAt: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
        meetingLink: 'https://teams.microsoft.com/meet/campusconnect-test-round',
        interviewerNotes: 'Please be ready with IDE for live coding interview.',
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return `Scheduled Interview Round: ${data.data.round}`;
  });

  await testStep('Recruiter', 'Export Applicants CSV', async () => {
    const res = await fetch(`${API_BASE}/recruiters/jobs/${createdJobId}/export`, {
      headers: { Authorization: `Bearer ${recruiterToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csv = await res.text();
    return `Exported CSV (${csv.split('\n').length} rows)`;
  });

  // 5. PLACEMENT OFFICER PORTAL WORKFLOWS
  console.log('\n--- 5. Testing Placement Officer Portal Workflows ---');
  await testStep('Officer', 'Fetch Comprehensive Placement Analytics KPIs', async () => {
    const res = await fetch(`${API_BASE}/placement/analytics`, {
      headers: { Authorization: `Bearer ${officerToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const kpis = data.data.kpis;
    return `Placement Rate: ${kpis.placementRate}%, Avg Package: ₹${(kpis.averagePackage / 100000).toFixed(1)}L, Total Offers: ${kpis.totalOffers}`;
  });

  await testStep('Officer', 'List Platform Users', async () => {
    const res = await fetch(`${API_BASE}/placement/users?page=1&limit=10`, {
      headers: { Authorization: `Bearer ${officerToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return `Retrieved ${data.data.users.length} users (total: ${data.data.total})`;
  });

  await testStep('Officer', 'Create Placement Drive', async () => {
    const res = await fetch(`${API_BASE}/placement/drives`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${officerToken}`,
      },
      body: JSON.stringify({
        name: 'Phase II Winter Engineering Placement Drive 2025',
        academicYear: '2024-2025',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
        eligibleDepartments: ['Computer Science and Engineering', 'Information Technology', 'Electronics and Communication'],
        minCgpa: 7.0,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    testDriveId = data.data._id;
    return `Created drive: "${data.data.name}"`;
  });

  await testStep('Officer', 'Fetch Audit Logs', async () => {
    const res = await fetch(`${API_BASE}/placement/audit-logs?limit=5`, {
      headers: { Authorization: `Bearer ${officerToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return `Retrieved ${data.data.logs.length} system audit logs`;
  });

  await testStep('Officer', 'Export Overall Placement Report CSV', async () => {
    const res = await fetch(`${API_BASE}/placement/export-report`, {
      headers: { Authorization: `Bearer ${officerToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const csv = await res.text();
    return `Exported placement report (${csv.split('\n').length} rows)`;
  });

  // 6. ALUMNI WORKFLOWS
  console.log('\n--- 6. Testing Alumni Workflows ---');
  await testStep('Alumni', 'Fetch Alumni Profile Details', async () => {
    const res = await fetch(`${API_BASE}/alumni/profile`, {
      headers: { Authorization: `Bearer ${alumniToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return `Alumni: ${data.data.currentCompany}, Available: ${data.data.isAvailableForMentorship}`;
  });

  if (alumniUserId) {
    await testStep('Alumni', 'Student Submits Mentorship Request', async () => {
      const res = await fetch(`${API_BASE}/alumni/mentorship-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${studentToken}`,
        },
        body: JSON.stringify({
          alumniUserId,
          topic: 'System Design Interview Preparation',
          message: 'Hello Amit sir, I would appreciate your guidance on large-scale distributed systems and interview prep.',
        }),
      });
      const data = await res.json();
      if (res.status === 201) {
        return `Created mentorship request ID: ${data.data._id}`;
      } else if (res.status === 409) {
        return `Mentorship request already exists (Duplicate protected)`;
      } else {
        throw new Error(`HTTP ${res.status}: ${data.message}`);
      }
    });
  }

  await testStep('Alumni', 'Alumni Lists Mentorship Requests', async () => {
    const res = await fetch(`${API_BASE}/alumni/mentorship-requests`, {
      headers: { Authorization: `Bearer ${alumniToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return `Found ${data.data.length} mentorship requests`;
  });

  await testStep('Alumni', 'Alumni Creates Technical Workshop Event', async () => {
    const res = await fetch(`${API_BASE}/alumni/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${alumniToken}`,
      },
      body: JSON.stringify({
        title: 'Cracking FAANG System Design & DSA Interviews',
        description: 'Interactive session covering microservices, caching strategies, and live coding exercises.',
        eventType: 'workshop',
        eventDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
        durationMinutes: 90,
        locationOrLink: 'https://meet.google.com/xyz-alumni-workshop',
        maxAttendees: 150,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    testEventId = data.data._id;
    return `Created event: "${data.data.title}" (ID: ${testEventId})`;
  });

  if (testEventId) {
    await testStep('Alumni', 'Student Registers for Alumni Event', async () => {
      const res = await fetch(`${API_BASE}/alumni/events/${testEventId}/register`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      const data = await res.json();
      if (res.status === 200 || res.status === 201) {
        return `Registered for workshop (Current attendees: ${data.data?.event?.registeredCount || 1})`;
      } else if (res.status === 409) {
        return 'Already registered for this event';
      } else {
        throw new Error(`HTTP ${res.status}: ${data.message}`);
      }
    });
  }

  // 7. IN-APP NOTIFICATIONS
  console.log('\n--- 7. Testing In-App Notification System ---');
  await testStep('Notifications', 'Get Live Unread Count', async () => {
    const res = await fetch(`${API_BASE}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return `Unread notifications: ${data.data.unreadCount}`;
  });

  await testStep('Notifications', 'List Notifications', async () => {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: { Authorization: `Bearer ${studentToken}` },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.data.notifications.length > 0) {
      testNotificationId = data.data.notifications[0]._id;
    }
    return `Retrieved ${data.data.notifications.length} notifications`;
  });

  if (testNotificationId) {
    await testStep('Notifications', 'Mark Notification as Read', async () => {
      const res = await fetch(`${API_BASE}/notifications/${testNotificationId}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${studentToken}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return `Marked notification as read (${data.data.isRead})`;
    });
  }

  // 8. FASTAPI AI MICROSERVICE DIRECT VERIFICATION
  console.log('\n--- 8. Testing FastAPI AI Microservice Directly ---');
  await testStep('AI Microservice', 'FastAPI Health Status', async () => {
    const res = await fetch(`${AI_BASE}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return `${data.service} v${data.version}`;
  });

  await testStep('AI Microservice', 'Job-Skill Match Computation (/api/v1/match)', async () => {
    const res = await fetch(`${AI_BASE}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student: {
          student_id: 'std-test-01',
          department: 'Computer Science and Engineering',
          cgpa: 8.8,
          graduation_year: 2025,
          skills: ['Python', 'FastAPI', 'Docker', 'PostgreSQL', 'Machine Learning'],
          certifications: ['AWS Cloud Practitioner'],
          projects: ['Distributed AI matching platform with TF-IDF cosine similarity'],
          experience_months: 6,
        },
        job: {
          job_id: 'job-test-01',
          title: 'AI/ML Engineering Intern',
          company_name: 'Microsoft',
          required_skills: ['Python', 'FastAPI', 'Machine Learning'],
          preferred_skills: ['Docker', 'PostgreSQL'],
          eligible_departments: ['Computer Science and Engineering', 'Information Technology'],
          min_cgpa: 7.5,
          target_graduation_years: [2025, 2026],
          experience_required_months: 0,
          job_type: 'internship',
          description: 'Looking for ML engineers with strong Python and FastAPI fundamentals.',
        },
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (typeof data.match_score !== 'number') throw new Error('Missing match_score');
    return `Score: ${data.match_score}%, Eligible: ${data.is_eligible}, Skills Matched: ${data.matched_skills.join(', ')}`;
  });

  await testStep('AI Microservice', 'Batch Recommendation Engine (/api/v1/recommend)', async () => {
    const res = await fetch(`${AI_BASE}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student: {
          student_id: 'std-test-02',
          department: 'Computer Science and Engineering',
          cgpa: 8.5,
          graduation_year: 2025,
          skills: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
          certifications: [],
          projects: ['Full stack portal with Express and React'],
          experience_months: 0,
        },
        jobs: [
          {
            job_id: 'job-101',
            title: 'Full Stack Developer',
            company_name: 'Tech Corp',
            required_skills: ['React', 'Node.js', 'MongoDB'],
            preferred_skills: ['TypeScript'],
            eligible_departments: ['Computer Science and Engineering'],
            min_cgpa: 7.0,
            target_graduation_years: [2025],
            experience_required_months: 0,
            job_type: 'full_time',
            description: 'React and Node.js developer needed.',
          },
          {
            job_id: 'job-102',
            title: 'Embedded Systems Engineer',
            company_name: 'Hardware Corp',
            required_skills: ['VHDL', 'Assembly'],
            preferred_skills: ['C'],
            eligible_departments: ['Electrical Engineering'],
            min_cgpa: 7.0,
            target_graduation_years: [2025],
            experience_required_months: 0,
            job_type: 'full_time',
            description: 'VHDL and assembly programming.',
          },
        ],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data.recommendations)) throw new Error('Missing recommendations');
    const top = data.recommendations[0];
    return `Ranked ${data.recommendations.length} jobs. Top job ID: ${top.job_id} (Score: ${top.match_score}%)`;
  });

  // SUMMARY REPORT
  console.log('\n=============================================================');
  console.log('                   VERIFICATION SUMMARY                      ');
  console.log('=============================================================');
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  console.log(`Total Functions Tested: ${results.length}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed Tests:');
    results.filter((r) => r.status === 'FAIL').forEach((r) => console.log(`  - [${r.category}] ${r.name}: ${r.detail}`));
  }
  console.log('=============================================================\n');

  return { total: results.length, passed, failed, results };
}

runAllTests().catch((err) => {
  console.error('Fatal test runner failure:', err);
  process.exit(1);
});
