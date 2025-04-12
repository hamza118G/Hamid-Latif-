// server/routes/patient.js
const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// server/routes/patient.js
router.get('/all-records', authMiddleware, async (req, res) => {
  try {
    const allPatients = await Patient.find().lean().sort({ createdAt: -1 });
    res.json(allPatients);
  } catch (error) {
    console.error('Error in /all-records:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add new patient record
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const {
      patientName, uniquePatientId, patientId, cnic, age, gender, bmi, comorbidities,
      familyHistory, menopausalHistory, phoneNumber, currentAddress,phoneNumber2, currentAddress2, dateOfDiagnosis,
      modeOfHistologicalDiagnosis, multifocalBreastCancer, lateralityOfBreastCancer,
      histopathologicalGrade, morphologyOfBreastCancer, ki67, tumorSize, lymphNodeStatus,
      clinicalStage, brcaMutationStatus, pdla1Expression, neoadjuvantChemotherapy,
      anyTreatmentDelays, treatmentDelaysReason, doseModification, doseModificationReason,
      adverseEventsNoted, adverseEventsReason, radiologicalResponse, pathologicalResponse,
      typesOfSurgery, axillaryDissectionPerformed, adjuvantTreatment, dateOfLastFollowUp,
      relapse, siteOfRelapse, distantRelapseSite, diseaseFreeSurvival, overallSurvival
    } = req.body;
    const patient = new Patient({
      patientName, uniquePatientId, patientId, cnic, age, gender, bmi, comorbidities,
      familyHistory, menopausalHistory, phoneNumber, currentAddress, phoneNumber2, currentAddress2,dateOfDiagnosis,
      modeOfHistologicalDiagnosis, multifocalBreastCancer, lateralityOfBreastCancer,
      histopathologicalGrade, morphologyOfBreastCancer, ki67, tumorSize, lymphNodeStatus,
      clinicalStage, brcaMutationStatus, pdla1Expression, neoadjuvantChemotherapy,
      anyTreatmentDelays, treatmentDelaysReason, doseModification, doseModificationReason,
      adverseEventsNoted, adverseEventsReason, radiologicalResponse, pathologicalResponse,
      typesOfSurgery, axillaryDissectionPerformed, adjuvantTreatment, dateOfLastFollowUp,
      relapse, siteOfRelapse, distantRelapseSite, diseaseFreeSurvival, overallSurvival,
      userId: req.userId
    });
    await patient.save();
    res.status(201).json({ message: 'Patient record added', patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all patient records for the logged-in user
router.get('/records', authMiddleware, async (req, res) => {
  try {
    const patients = await Patient.find({ userId: req.userId });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update patient record
router.put('/update/:id', authMiddleware, async (req, res) => {
  try {
    const {
      patientName, uniquePatientId, patientId, cnic, age, gender, bmi, comorbidities,
      familyHistory, menopausalHistory, phoneNumber, currentAddress,phoneNumber2, currentAddress2, dateOfDiagnosis,
      modeOfHistologicalDiagnosis, multifocalBreastCancer, lateralityOfBreastCancer,
      histopathologicalGrade, morphologyOfBreastCancer, ki67, tumorSize, lymphNodeStatus,
      clinicalStage, brcaMutationStatus, pdla1Expression, neoadjuvantChemotherapy,
      anyTreatmentDelays, treatmentDelaysReason, doseModification, doseModificationReason,
      adverseEventsNoted, adverseEventsReason, radiologicalResponse, pathologicalResponse,
      typesOfSurgery, axillaryDissectionPerformed, adjuvantTreatment, dateOfLastFollowUp,
      relapse, siteOfRelapse, distantRelapseSite, diseaseFreeSurvival, overallSurvival
    } = req.body;
    const patient = await Patient.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        patientName, uniquePatientId, patientId, cnic, age, gender, bmi, comorbidities,
        familyHistory, menopausalHistory, phoneNumber, currentAddress,phoneNumber2, currentAddress2, dateOfDiagnosis,
        modeOfHistologicalDiagnosis, multifocalBreastCancer, lateralityOfBreastCancer,
        histopathologicalGrade, morphologyOfBreastCancer, ki67, tumorSize, lymphNodeStatus,
        clinicalStage, brcaMutationStatus, pdla1Expression, neoadjuvantChemotherapy,
        anyTreatmentDelays, treatmentDelaysReason, doseModification, doseModificationReason,
        adverseEventsNoted, adverseEventsReason, radiologicalResponse, pathologicalResponse,
        typesOfSurgery, axillaryDissectionPerformed, adjuvantTreatment, dateOfLastFollowUp,
        relapse, siteOfRelapse, distantRelapseSite, diseaseFreeSurvival, overallSurvival
      },
      { new: true }
    );
    if (!patient) return res.status(404).json({ message: 'Patient record not found' });
    res.json({ message: 'Patient updated', patient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete patient record
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Patient not found' });
    res.json({ message: 'Patient deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get total number of patient records
router.get('/total', async (req, res) => {
  try {
    const total = await Patient.countDocuments();
    res.json({ total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all patient records (Accessible to all authenticated users)
router.get('/all-records', authMiddleware, async (req, res) => {
  try {
    const allPatients = await Patient.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(allPatients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;