const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  // Patient Demographics & Baseline Characteristics
  patientName: { type: String, required: true },
  uniquePatientId: { type: String, required: true, unique: true },
  patientId: { type: String, required: true },
  cnic: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['MALE', 'FEMALE'], required: true },
  bmi: { type: Number, required: true },
  comorbidities: { type: String },
  familyHistory: { type: String },
  menopausalHistory: { type: String },
  phoneNumber: { type: String, required: true },
  currentAddress: { type: String, required: true },
  phoneNumber2: { type: String, required: true },
  currentAddress2: { type: String, required: true },
  // Breast Cancer Details
  dateOfDiagnosis: { type: Date },
  modeOfHistologicalDiagnosis: { type: String, enum: ['Trucut Biopsy', 'FNAC', 'Others'] },
  multifocalBreastCancer: { type: String, enum: ['Yes', 'No', 'Unknown'] },
  lateralityOfBreastCancer: { type: String, enum: ['Right', 'Left', 'B/L'] },
  histopathologicalGrade: { type: String, enum: ['Grade I', 'Grade II', 'Grade III'] },
  morphologyOfBreastCancer: { type: String, enum: ['Ductal', 'Lobular', 'Mixed Duct&lobu', 'Others'] },
  ki67: { type: Number }, // Percentage
  tumorSize: { type: String, enum: ['T0', 'T1', 'T2', 'T3', 'T4'] },
  lymphNodeStatus: { type: String, enum: ['N0', 'N1', 'N2', 'N3'] },
  clinicalStage: { type: String, enum: ['Stage I', 'Stage II', 'Stage III'] },
  brcaMutationStatus: { type: String, enum: ['BRCA 1', 'BRCA 2', 'Others', 'Unknown'] },
  pdla1Expression: { type: String, enum: ['Positive', 'Negative', 'Not Done'] },
  // Treatment Protocol
  neoadjuvantChemotherapy: [{
    cycle: { type: String, enum: [
      'Cycle 01: Carboplatin + Paclitaxel + Atezolizumab',
      'Cycle 02: Carboplatin + Paclitaxel + Atezolizumab',
      'Cycle 03: Carboplatin + Paclitaxel + Atezolizumab',
      'Cycle 04: Carboplatin + Paclitaxel',
      'Cycle 01: Adriamycin + Cyclophosphamide + Atezolizumab',
      'Cycle 02: Adriamycin + Cyclophosphamide',
      'Cycle 03: Adriamycin + Cyclophosphamide',
      'Cycle 04: Adriamycin + Cyclophosphamide',
      'Regiment'
    ] },
    date: { type: Date },
    clinicalExamination: { type: String }
  }],
  anyTreatmentDelays: { type: String, enum: ['Yes', 'No', 'Delay >7 days'] },
  treatmentDelaysReason: { type: String },
  doseModification: { type: String, enum: ['Yes', 'No'] },
  doseModificationReason: { type: String },
  adverseEventsNoted: { type: String, enum: ['Yes', 'No'] },
  adverseEventsReason: { type: String },
  // Response to Treatment
  radiologicalResponse: { type: String, enum: ['CR', 'PR', 'SD', 'PD'] },
  pathologicalResponse: {
    pcr: { type: String, enum: ['YES', 'NO'] },
    ypTONO: { type: String },
    ypT: { type: String },
    ypN: { type: String }
  },
  typesOfSurgery: { type: String }, // Changed to a simple String type to allow custom values
  otherSurgeryType:{type:String},
  // Survival & Follow-Up
  dateOfLastFollowUp: { type: Date },
  relapse: { type: String, enum: ['Yes', 'No'] },
  siteOfRelapse: { type: String, enum: ['Local', 'Distant'] },
  distantRelapseSite: { type: String },
  diseaseFreeSurvival: { type: Number }, // Months
  overallSurvival: { type: Number }, // Months
  // Existing fields
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Patient', patientSchema);