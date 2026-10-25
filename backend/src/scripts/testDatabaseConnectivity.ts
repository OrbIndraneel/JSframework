import 'dotenv/config';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { StudentProfile } from '../models/StudentProfile.js';
import { Company } from '../models/Company.js';
import { RecruiterProfile } from '../models/RecruiterProfile.js';
import { AlumniProfile } from '../models/AlumniProfile.js';
import { Job } from '../models/Job.js';
import { PlacementDrive } from '../models/PlacementDrive.js';
import { Application } from '../models/Application.js';
import { Interview } from '../models/Interview.js';
import { MentorshipRequest } from '../models/MentorshipRequest.js';
import { Event } from '../models/Event.js';
import { EventRegistration } from '../models/EventRegistration.js';
import { Notification } from '../models/Notification.js';
import { AuditLog } from '../models/AuditLog.js';

async function runDatabaseDiagnostic() {
  console.log('=====================================================');
  console.log('   CAMPUSCONNECT DATABASE & BACKEND DIAGNOSTIC       ');
  console.log('=====================================================\n');

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('ERROR: MONGODB_URI is not defined in backend/.env');
    process.exit(1);
  }

  // Sanitize URI for safe display
  const sanitizedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:*****@');
  console.log(`Connecting to database target:\n${sanitizedUri}\n`);

  const startTime = Date.now();

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 15000 });
    const connectLatency = Date.now() - startTime;
    console.log(`[PASS] MongoDB Connection established in ${connectLatency}ms.`);

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database instance unavailable after connection.');
    }

    // 1. Run Admin Ping Command
    console.log('\n--- 1. Database Ping Command ---');
    const pingStart = Date.now();
    const pingResult = await db.admin().ping();
    const pingLatency = Date.now() - pingStart;
    console.log(`[PASS] Database ping acknowledged in ${pingLatency}ms:`, pingResult);

    // 2. Query Collection Statistics & Document Counts
    console.log('\n--- 2. Inspecting All Data Models & Document Counts ---');
    const modelChecks: { name: string; model: any }[] = [
      { name: 'Users', model: User },
      { name: 'StudentProfiles', model: StudentProfile },
      { name: 'Companies', model: Company },
      { name: 'RecruiterProfiles', model: RecruiterProfile },
      { name: 'AlumniProfiles', model: AlumniProfile },
      { name: 'Jobs', model: Job },
      { name: 'PlacementDrives', model: PlacementDrive },
      { name: 'Applications', model: Application },
      { name: 'Interviews', model: Interview },
      { name: 'MentorshipRequests', model: MentorshipRequest },
      { name: 'Events', model: Event },
      { name: 'EventRegistrations', model: EventRegistration },
      { name: 'Notifications', model: Notification },
      { name: 'AuditLogs', model: AuditLog },
    ];

    const counts: Record<string, number> = {};
    for (const check of modelChecks) {
      const count = await check.model.countDocuments();
      counts[check.name] = count;
      console.log(`  - ${check.name.padEnd(20)} : ${count} documents`);
    }

    // 3. Test Full Read/Write/Update/Delete (CRUD) Lifecycle
    console.log('\n--- 3. Testing Real-time Write, Read, Update, and Delete ---');
    const testEmail = `healthcheck_${Date.now()}@test.internal`;
    const crudStart = Date.now();

    // CREATE
    const testUser = await User.create({
      name: 'Diagnostic Temp User',
      email: testEmail,
      password: 'TemporaryPassword@999',
      role: 'student',
      isVerified: false,
    });
    console.log(`  [PASS] CREATE: Created temporary test document ID: ${testUser._id}`);

    // READ
    const fetchedUser = await User.findOne({ email: testEmail });
    if (!fetchedUser || fetchedUser._id.toString() !== testUser._id.toString()) {
      throw new Error('READ verification failed: Document not retrieved accurately.');
    }
    console.log('  [PASS] READ: Successfully queried document by indexed email.');

    // UPDATE
    fetchedUser.name = 'Diagnostic Temp User Updated';
    await fetchedUser.save();
    console.log('  [PASS] UPDATE: Successfully executed document update.');

    // DELETE
    await User.deleteOne({ _id: testUser._id });
    const checkDeleted = await User.findById(testUser._id);
    if (checkDeleted) {
      throw new Error('DELETE verification failed: Document still exists.');
    }
    console.log('  [PASS] DELETE: Cleaned up temporary test document safely.');

    const crudLatency = Date.now() - crudStart;
    console.log(`[PASS] Full CRUD verification completed in ${crudLatency}ms.`);

    console.log('\n=====================================================');
    console.log('   ALL DATABASE & BACKEND SERVICES ARE OPERATIONAL   ');
    console.log('=====================================================\n');
  } catch (error: any) {
    console.error('\n[FAIL] Diagnostic failure:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected gracefully from database.');
  }
}

runDatabaseDiagnostic();
