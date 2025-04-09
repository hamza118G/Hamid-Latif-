// client/src/components/EditRecord.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function EditRecord() {
  // Patient Demographics & Baseline Characteristics
  const [patientName, setPatientName] = useState('');
  const [uniquePatientId, setUniquePatientId] = useState('');
  const [patientId, setPatientId] = useState('');
  const [cnic, setCnic] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bmi, setBmi] = useState('');
  const [comorbidities, setComorbidities] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [menopausalHistory, setMenopausalHistory] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  // Breast Cancer Details
  const [dateOfDiagnosis, setDateOfDiagnosis] = useState('');
  const [modeOfHistologicalDiagnosis, setModeOfHistologicalDiagnosis] = useState('');
  const [multifocalBreastCancer, setMultifocalBreastCancer] = useState('');
  const [lateralityOfBreastCancer, setLateralityOfBreastCancer] = useState('');
  const [histopathologicalGrade, setHistopathologicalGrade] = useState('');
  const [morphologyOfBreastCancer, setMorphologyOfBreastCancer] = useState('');
  const [ki67, setKi67] = useState('');
  const [tumorSize, setTumorSize] = useState('');
  const [lymphNodeStatus, setLymphNodeStatus] = useState('');
  const [clinicalStage, setClinicalStage] = useState('');
  const [brcaMutationStatus, setBrcaMutationStatus] = useState('');
  const [pdla1Expression, setPdla1Expression] = useState('');
  // Treatment Protocol
  const [neoadjuvantChemotherapy, setNeoadjuvantChemotherapy] = useState([]);
  const [anyTreatmentDelays, setAnyTreatmentDelays] = useState('');
  const [treatmentDelaysReason, setTreatmentDelaysReason] = useState('');
  const [doseModification, setDoseModification] = useState('');
  const [doseModificationReason, setDoseModificationReason] = useState('');
  const [adverseEventsNoted, setAdverseEventsNoted] = useState('');
  const [adverseEventsReason, setAdverseEventsReason] = useState('');
  // Response to Treatment
  const [radiologicalResponse, setRadiologicalResponse] = useState('');
  const [pathologicalResponse, setPathologicalResponse] = useState({ pcr: '', ypTONO: '', ypT: '', ypN: '' });
  const [typesOfSurgery, setTypesOfSurgery] = useState('');
  const [axillaryDissectionPerformed, setAxillaryDissectionPerformed] = useState('');
  const [adjuvantTreatment, setAdjuvantTreatment] = useState('');
  // Survival & Follow-Up
  const [dateOfLastFollowUp, setDateOfLastFollowUp] = useState('');
  const [relapse, setRelapse] = useState('');
  const [siteOfRelapse, setSiteOfRelapse] = useState('');
  const [distantRelapseSite, setDistantRelapseSite] = useState('');
  const [diseaseFreeSurvival, setDiseaseFreeSurvival] = useState('');
  const [overallSurvival, setOverallSurvival] = useState('');
  const [error, setError] = useState('');
  const [otherSurgeryType, setOtherSurgeryType] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchPatient = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/patient/records`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const patient = response.data.find(p => p._id === id);
        if (patient) {
          setPatientName(patient.patientName);
          setUniquePatientId(patient.uniquePatientId);
          setPatientId(patient.patientId);
          setCnic(patient.cnic);
          setAge(patient.age);
          setGender(patient.gender);
          setBmi(patient.bmi);
          setComorbidities(patient.comorbidities || '');
          setFamilyHistory(patient.familyHistory || '');
          setMenopausalHistory(patient.menopausalHistory || '');
          setPhoneNumber(patient.phoneNumber);
          setCurrentAddress(patient.currentAddress);
          setDateOfDiagnosis(patient.dateOfDiagnosis ? patient.dateOfDiagnosis.split('T')[0] : '');
          setModeOfHistologicalDiagnosis(patient.modeOfHistologicalDiagnosis || '');
          setMultifocalBreastCancer(patient.multifocalBreastCancer || '');
          setLateralityOfBreastCancer(patient.lateralityOfBreastCancer || '');
          setHistopathologicalGrade(patient.histopathologicalGrade || '');
          setMorphologyOfBreastCancer(patient.morphologyOfBreastCancer || '');
          setKi67(patient.ki67 || '');
          setTumorSize(patient.tumorSize || '');
          setLymphNodeStatus(patient.lymphNodeStatus || '');
          setClinicalStage(patient.clinicalStage || '');
          setBrcaMutationStatus(patient.brcaMutationStatus || '');
          setPdla1Expression(patient.pdla1Expression || '');
          setNeoadjuvantChemotherapy(patient.neoadjuvantChemotherapy || []);
          setAnyTreatmentDelays(patient.anyTreatmentDelays || '');
          setTreatmentDelaysReason(patient.treatmentDelaysReason || '');
          setDoseModification(patient.doseModification || '');
          setDoseModificationReason(patient.doseModificationReason || '');
          setAdverseEventsNoted(patient.adverseEventsNoted || '');
          setAdverseEventsReason(patient.adverseEventsReason || '');
          setRadiologicalResponse(patient.radiologicalResponse || '');
          setPathologicalResponse({
            pcr: patient.pathologicalResponse?.pcr || '',
            ypTONO: patient.pathologicalResponse?.ypTONO || '',
            ypT: patient.pathologicalResponse?.ypT || '',
            ypN: patient.pathologicalResponse?.ypN || ''
          });
          const predefinedOptions = ["Breast Conservation Surgery", "MRM (Modified Radical Mastectomy)"];
        if (predefinedOptions.includes(patient.typesOfSurgery)) {
          setTypesOfSurgery(patient.typesOfSurgery || '');
          setOtherSurgeryType('');
        } else {
          setTypesOfSurgery("Others");
          setOtherSurgeryType(patient.typesOfSurgery || '');
        }
          setAxillaryDissectionPerformed(patient.axillaryDissectionPerformed || '');
          setAdjuvantTreatment(patient.adjuvantTreatment || '');
          setDateOfLastFollowUp(patient.dateOfLastFollowUp ? patient.dateOfLastFollowUp.split('T')[0] : '');
          setRelapse(patient.relapse || '');
          setSiteOfRelapse(patient.siteOfRelapse || '');
          setDistantRelapseSite(patient.distantRelapseSite || '');
          setDiseaseFreeSurvival(patient.diseaseFreeSurvival || '');
          setOverallSurvival(patient.overallSurvival || '');
        } else {
          setError('Patient record not found');
        }
      } catch (error) {
        console.error('Error fetching patient:', error);
        setError('Failed to load patient record');
      }
    };
    fetchPatient();
  }, [id]);

  const handleAddCycle = () => {
    setNeoadjuvantChemotherapy([...neoadjuvantChemotherapy, { cycle: '', date: '', clinicalExamination: '' }]);
  };

  const handleCycleChange = (index, field, value) => {
    const updatedCycles = [...neoadjuvantChemotherapy];
    updatedCycles[index][field] = value;
    setNeoadjuvantChemotherapy(updatedCycles);
  };

  const handlePathologicalResponseChange = (field, value) => {
    setPathologicalResponse(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://localhost:5000/api/patient/update/${id}`,
        {
          patientName, uniquePatientId, patientId, cnic, age: Number(age), gender, bmi: Number(bmi),
          comorbidities, familyHistory, menopausalHistory, phoneNumber, currentAddress,
          dateOfDiagnosis: dateOfDiagnosis || null, modeOfHistologicalDiagnosis, multifocalBreastCancer,
          lateralityOfBreastCancer, histopathologicalGrade, morphologyOfBreastCancer,
          ki67: ki67 ? Number(ki67) : null, tumorSize, lymphNodeStatus, clinicalStage,
          brcaMutationStatus, pdla1Expression, neoadjuvantChemotherapy, anyTreatmentDelays,
          treatmentDelaysReason, doseModification, doseModificationReason, adverseEventsNoted,
          adverseEventsReason, radiologicalResponse, pathologicalResponse, 
          typesOfSurgery: typesOfSurgery === "Others" ? otherSurgeryType : typesOfSurgery,
          axillaryDissectionPerformed, adjuvantTreatment, dateOfLastFollowUp: dateOfLastFollowUp || null,
          relapse, siteOfRelapse, distantRelapseSite, diseaseFreeSurvival: diseaseFreeSurvival ? Number(diseaseFreeSurvival) : null,
          overallSurvival: overallSurvival ? Number(overallSurvival) : null
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/home');
    } catch (error) {
      console.error('Error updating record:', error);
      setError(error.response?.data?.message || 'Failed to update record');
    }
  };

  return (
    <Container className="my-5">
      <Card className="vibrant-card">
        <Card.Body>
          <Card.Title className="text-center mb-4">Edit Patient Record</Card.Title>
          {error ? (
            <div className="text-center text-danger mb-4">{error}</div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {/* Patient Demographics & Baseline Characteristics */}
              <h5 className="mb-3">Patient Demographics & Baseline Characteristics</h5>
              <Form.Group className="mb-3"><Form.Label>Patient Name</Form.Label><Form.Control type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} placeholder="Enter patient name" required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Unique Patient ID</Form.Label><Form.Control type="text" value={uniquePatientId} onChange={(e) => setUniquePatientId(e.target.value)} placeholder="Enter unique patient ID" required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Patient ID</Form.Label><Form.Control type="text" value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Enter patient ID" required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>CNIC</Form.Label><Form.Control type="text" value={cnic} onChange={(e) => setCnic(e.target.value)} placeholder="Enter CNIC" required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Age (Years)</Form.Label><Form.Control type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Enter age" required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Gender</Form.Label><Form.Select value={gender} onChange={(e) => setGender(e.target.value)} required><option value="">Select Gender</option><option value="MALE">MALE</option><option value="FEMALE">FEMALE</option></Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>BMI (kg/m²)</Form.Label><Form.Control type="number" step="0.1" value={bmi} onChange={(e) => setBmi(e.target.value)} placeholder="Enter BMI" required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Comorbidities</Form.Label><Form.Control type="text" value={comorbidities} onChange={(e) => setComorbidities(e.target.value)} placeholder="Enter comorbidities (optional)" /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Family History</Form.Label><Form.Control type="text" value={familyHistory} onChange={(e) => setFamilyHistory(e.target.value)} placeholder="Enter family history (optional)" /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Menopausal History</Form.Label><Form.Control type="text" value={menopausalHistory} onChange={(e) => setMenopausalHistory(e.target.value)} placeholder="Enter menopausal history (optional)" /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Phone Number</Form.Label><Form.Control type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Enter phone number" required /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Current Address</Form.Label><Form.Control type="text" value={currentAddress} onChange={(e) => setCurrentAddress(e.target.value)} placeholder="Enter current address" required /></Form.Group>

              {/* Breast Cancer Details */}
              <h5 className="mb-3">Breast Cancer Details</h5>
              <Form.Group className="mb-3"><Form.Label>Date of Diagnosis</Form.Label><Form.Control type="date" value={dateOfDiagnosis} onChange={(e) => setDateOfDiagnosis(e.target.value)} /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Mode of Histological Diagnosis</Form.Label><Form.Select value={modeOfHistologicalDiagnosis} onChange={(e) => setModeOfHistologicalDiagnosis(e.target.value)}><option value="">Select Mode</option><option value="Trucut Biopsy">Trucut Biopsy</option><option value="FNAC">FNAC</option><option value="Others">Others</option></Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Multifocal Breast Cancer</Form.Label><Form.Select value={multifocalBreastCancer} onChange={(e) => setMultifocalBreastCancer(e.target.value)}><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option><option value="Unknown">Unknown</option></Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Laterality of Breast Cancer</Form.Label><Form.Select value={lateralityOfBreastCancer} onChange={(e) => setLateralityOfBreastCancer(e.target.value)}><option value="">Select</option><option value="Right">Right</option><option value="Left">Left</option><option value="B/L">B/L</option></Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Histopathological Grade</Form.Label><Form.Select value={histopathologicalGrade} onChange={(e) => setHistopathologicalGrade(e.target.value)}><option value="">Select Grade</option><option value="Grade I">Grade I</option><option value="Grade II">Grade II</option><option value="Grade III">Grade III</option></Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Morphology of Breast Cancer</Form.Label><Form.Select value={morphologyOfBreastCancer} onChange={(e) => setMorphologyOfBreastCancer(e.target.value)}><option value="">Select Morphology</option><option value="Ductal">Ductal</option><option value="Lobular">Lobular</option><option value="Mixed Duct&lobu">Mixed Duct&lobu</option><option value="Others">Others</option></Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Ki67 (%)</Form.Label><Form.Control type="number" step="0.1" value={ki67} onChange={(e) => setKi67(e.target.value)} placeholder="Enter Ki67 percentage" /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Tumor Size</Form.Label><Form.Select value={tumorSize} onChange={(e) => setTumorSize(e.target.value)}><option value="">Select Size</option><option value="T0">T0</option><option value="T1">T1</option><option value="T2">T2</option><option value="T3">T3</option><option value="T4">T4</option></Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Lymph Node Status</Form.Label><Form.Select value={lymphNodeStatus} onChange={(e) => setLymphNodeStatus(e.target.value)}><option value="">Select Status</option><option value="N0">N0</option><option value="N1">N1</option><option value="N2">N2</option><option value="N3">N3</option></Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Clinical Stage @ Diagnosis</Form.Label><Form.Select value={clinicalStage} onChange={(e) => setClinicalStage(e.target.value)}><option value="">Select Stage</option><option value="Stage I">Stage I</option><option value="Stage II">Stage II</option><option value="Stage III">Stage III</option></Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>BRCA 1 Mutation Status</Form.Label><Form.Select value={brcaMutationStatus} onChange={(e) => setBrcaMutationStatus(e.target.value)}><option value="">Select Status</option><option value="BRCA 1">BRCA 1</option><option value="BRCA 2">BRCA 2</option><option value="Others">Others</option><option value="Unknown">Unknown</option></Form.Select></Form.Group>
              <Form.Group className="mb-3"><Form.Label>PDL-1 Expression (SP142)</Form.Label><Form.Select value={pdla1Expression} onChange={(e) => setPdla1Expression(e.target.value)}><option value="">Select Expression</option><option value="Positive">Positive</option><option value="Negative">Negative</option><option value="Not Done">Not Done</option></Form.Select></Form.Group>

              {/* Treatment Protocol */}
              <h5 className="mb-3">Treatment Protocol</h5>
              <h6>Neoadjuvant Chemotherapy</h6>
              {neoadjuvantChemotherapy.map((cycle, index) => (
                <Row key={index} className="mb-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Cycle</Form.Label>
                      <Form.Select value={cycle.cycle} onChange={(e) => handleCycleChange(index, 'cycle', e.target.value)}>
                        <option value="">Select Cycle</option>
                        <option value="Cycle 01: Carboplatin + Paclitaxel + Atezolizumab">Cycle 01: Carboplatin + Paclitaxel + Atezolizumab</option>
                        <option value="Cycle 02: Carboplatin + Paclitaxel + Atezolizumab">Cycle 02: Carboplatin + Paclitaxel + Atezolizumab</option>
                        <option value="Cycle 03: Carboplatin + Paclitaxel + Atezolizumab">Cycle 03: Carboplatin + Paclitaxel + Atezolizumab</option>
                        <option value="Cycle 04: Carboplatin + Paclitaxel">Cycle 04: Carboplatin + Paclitaxel</option>
                        <option value="Cycle 01: Adriamycin + Cyclophosphamide + Atezolizumab">Cycle 01: Adriamycin + Cyclophosphamide + Atezolizumab</option>
                        <option value="Cycle 02: Adriamycin + Cyclophosphamide">Cycle 02: Adriamycin + Cyclophosphamide</option>
                        <option value="Cycle 03: Adriamycin + Cyclophosphamide">Cycle 03: Adriamycin + Cyclophosphamide</option>
                        <option value="Cycle 04: Adriamycin + Cyclophosphamide">Cycle 04: Adriamycin + Cyclophosphamide</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Date</Form.Label>
                      <Form.Control type="date" value={cycle.date ? cycle.date.split('T')[0] : ''} onChange={(e) => handleCycleChange(index, 'date', e.target.value)} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Clinical Examination</Form.Label>
                      <Form.Control type="text" value={cycle.clinicalExamination} onChange={(e) => handleCycleChange(index, 'clinicalExamination', e.target.value)} placeholder="Enter clinical examination" />
                    </Form.Group>
                  </Col>
                </Row>
              ))}
              <Button variant="secondary" size="sm" onClick={handleAddCycle} className="mb-3">Add Chemotherapy Cycle</Button>
              <Form.Group className="mb-3"><Form.Label>Any Treatment Delays</Form.Label><Form.Select value={anyTreatmentDelays} onChange={(e) => setAnyTreatmentDelays(e.target.value)}><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option><option value="Delay >7 days">Delay More Than 7 days</option></Form.Select></Form.Group>
              {anyTreatmentDelays === 'Yes' && <Form.Group className="mb-3"><Form.Label>Reason for Treatment Delays</Form.Label><Form.Control type="text" value={treatmentDelaysReason} onChange={(e) => setTreatmentDelaysReason(e.target.value)} placeholder="Specify reason" /></Form.Group>}
              <Form.Group className="mb-3"><Form.Label>Dose Modification</Form.Label><Form.Select value={doseModification} onChange={(e) => setDoseModification(e.target.value)}><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option></Form.Select></Form.Group>
              {doseModification === 'Yes' && <Form.Group className="mb-3"><Form.Label>Reason for Dose Modification</Form.Label><Form.Control type="text" value={doseModificationReason} onChange={(e) => setDoseModificationReason(e.target.value)} placeholder="Specify reason" /></Form.Group>}
              <Form.Group className="mb-3"><Form.Label>Adverse Events Noted</Form.Label><Form.Select value={adverseEventsNoted} onChange={(e) => setAdverseEventsNoted(e.target.value)}><option value="">Select</option><option value="Yes">Yes</option><option value="No">No</option></Form.Select></Form.Group>
              {adverseEventsNoted === 'Yes' && <Form.Group className="mb-3"><Form.Label>Reason for Adverse Events</Form.Label><Form.Control type="text" value={adverseEventsReason} onChange={(e) => setAdverseEventsReason(e.target.value)} placeholder="Specify reason" /></Form.Group>}

              {/* Response to Treatment */}
              <h5 className="mb-3">Response to Treatment</h5>
              <Form.Group className="mb-3">
                <Form.Label>Radiological Response</Form.Label>
                <Form.Select value={radiologicalResponse} onChange={(e) => setRadiologicalResponse(e.target.value)}>
                  <option value="">Select</option>
                  <option value="CR">CR</option>
                  <option value="PR">PR</option>
                  <option value="SD">SD</option>
                  <option value="PD">PD</option>
                </Form.Select>
              </Form.Group>
              <h6>Pathological Response</h6>
              <Form.Group className="mb-3">
                <Form.Label>PCR</Form.Label>
                <Form.Select value={pathologicalResponse.pcr} onChange={(e) => handlePathologicalResponseChange('pcr', e.target.value)}>
                  <option value="">Select</option>
                  <option value="YES">YES</option>
                  <option value="NO">NO</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3"><Form.Label>YP TONO</Form.Label><Form.Control type="text" value={pathologicalResponse.ypTONO} onChange={(e) => handlePathologicalResponseChange('ypTONO', e.target.value)} placeholder="Enter YP TONO" /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>YP T</Form.Label><Form.Control type="text" value={pathologicalResponse.ypT} onChange={(e) => handlePathologicalResponseChange('ypT', e.target.value)} placeholder="Enter YP T" /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>YP N</Form.Label><Form.Control type="text" value={pathologicalResponse.ypN} onChange={(e) => handlePathologicalResponseChange('ypN', e.target.value)} placeholder="Enter YP N" /></Form.Group>
              <Form.Group className="mb-3">
  <Form.Label>Types of Surgery</Form.Label>
  <Form.Select
    value={typesOfSurgery}
    onChange={(e) => {
      const value = e.target.value;
      setTypesOfSurgery(value);
      // Reset otherSurgeryType if not "Others"
      if (value !== "Others") {
        setOtherSurgeryType('');
      }
    }}
  >
    <option value="">Select</option>
    <option value="Breast Conservation Surgery">Breast Conservation Surgery</option>
    <option value="MRM (Modified Radical Mastectomy)">MRM (Modified Radical Mastectomy)</option>
    <option value="Others">Others</option>
  </Form.Select>
</Form.Group>

{typesOfSurgery === "Others" && (
  <Form.Group className="mb-3">
    <Form.Label>Specify Other Surgery Type</Form.Label>
    <Form.Control
      type="text"
      value={otherSurgeryType}
      onChange={(e) => setOtherSurgeryType(e.target.value)}
      placeholder="Specify surgery type"
    />
  </Form.Group>
)}
              <Form.Group className="mb-3">
                <Form.Label>Adjuvant Treatment</Form.Label>
                <Form.Select value={adjuvantTreatment} onChange={(e) => setAdjuvantTreatment(e.target.value)}>
                  <option value="">Select</option>
                  <option value="Capecitabine">Capecitabine</option>
                  <option value="Olaparib">Olaparib</option>
                  <option value="No Therapy">No Therapy</option>
                </Form.Select>
              </Form.Group>

              {/* Survival & Follow-Up */}
              <h5 className="mb-3">Survival & Follow-Up</h5>
              <Form.Group className="mb-3"><Form.Label>Date of Last Follow-Up</Form.Label><Form.Control type="date" value={dateOfLastFollowUp} onChange={(e) => setDateOfLastFollowUp(e.target.value)} /></Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Relapse</Form.Label>
                <Form.Select value={relapse} onChange={(e) => setRelapse(e.target.value)}>
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </Form.Select>
              </Form.Group>
              {relapse === 'Yes' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Site of Relapse</Form.Label>
                    <Form.Select value={siteOfRelapse} onChange={(e) => setSiteOfRelapse(e.target.value)}>
                      <option value="">Select</option>
                      <option value="Local">Local</option>
                      <option value="Distant">Distant</option>
                    </Form.Select>
                  </Form.Group>
                  {siteOfRelapse === 'Distant' && (
                    <Form.Group className="mb-3">
                      <Form.Label>Specify Distant Relapse Site</Form.Label>
                      <Form.Control type="text" value={distantRelapseSite} onChange={(e) => setDistantRelapseSite(e.target.value)} placeholder="Specify site" />
                    </Form.Group>
                  )}
                </>
              )}
              <Form.Group className="mb-3"><Form.Label>Disease-Free Survival (Months)</Form.Label><Form.Control type="number" value={diseaseFreeSurvival} onChange={(e) => setDiseaseFreeSurvival(e.target.value)} placeholder="Enter months" /></Form.Group>
              <Form.Group className="mb-3"><Form.Label>Overall Survival (Months)</Form.Label><Form.Control type="number" value={overallSurvival} onChange={(e) => setOverallSurvival(e.target.value)} placeholder="Enter months" /></Form.Group>

              <Button className="btn-vibrant w-100" type="submit">Submit</Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default EditRecord;