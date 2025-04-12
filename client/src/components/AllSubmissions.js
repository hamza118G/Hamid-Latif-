import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FaTrash, FaPrint } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function AllSubmissions() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchAllPatients(token);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchAllPatients = async (token) => {
    try {
      setLoading(true); // Set loading to true while fetching
      const response = await axios.get('http://localhost:5000/api/patient/all-records', {
        headers: { Authorization: `Bearer ${token}` },
      });
   
      const sortedPatients = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPatients(sortedPatients);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error fetching all patients:', error);
      setError('Failed to fetch patient records. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient record?')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/patient/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedPatients = patients.filter(patient => patient._id !== id);
        setPatients(updatedPatients);
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Failed to delete patient: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const generatePDF = (patient) => {
    const doc = new jsPDF();
    doc.text("Patient Record", 14, 15);
    const chemoData = patient.neoadjuvantChemotherapy.map((chemo) => [
      chemo.cycle,
      new Date(chemo.date).toLocaleDateString(),
      chemo.clinicalExamination,
    ]);
    autoTable(doc, {
      startY: 20,
      headStyles: { fontSize: 12 },
      bodyStyles: { fontSize: 10, cellPadding: 4 },
      head: [['Field', 'Value']],
      body: [
        ['Patient Name', patient.patientName],
        ['Unique Patient ID', patient.uniquePatientId],
        ['Patient ID', patient.patientId],
        ['CNIC', patient.cnic],
        ['Age', patient.age],
        ['Gender', patient.gender],
        ['BMI', patient.bmi],
        ['Phone Number', patient.phoneNumber],
        ['Address', patient.currentAddress],
        ['Comorbidities', patient.comorbidities],
        ['Family History', patient.familyHistory],
        ['Menopausal History', patient.menopausalHistory],
        ['Date Of Diagnosis', new Date(patient.dateOfDiagnosis).toLocaleDateString()],
        ['Mode Of Histological Diagnosis', patient.modeOfHistologicalDiagnosis],
        ['Multi-Focal Breast Cancer', patient.multifocalBreastCancer],
        ['Laterality Of Breast Cancer', patient.lateralityOfBreastCancer],
        ['Histopathological Grade', patient.histopathologicalGrade],
        ['Morphology Of Breast Cancer', patient.morphologyOfBreastCancer],
        ['ki67', patient.ki67],
        ['Tumor Size', patient.tumorSize],
        ['Lymph Node Status', patient.lymphNodeStatus],
        ['Brca Mutation Status', patient.brcaMutationStatus],
        ['PDLA1 Expression', patient.pdla1Expression],
        ['Any Treatment Delays', patient.anyTreatmentDelays],
        ['Treatment Delays Reason', patient.treatmentDelaysReason],
        ['Dose Modification', patient.doseModification],
        ['Dose Modification Reason', patient.doseModificationReason],
        ['Adverse Events Noted', patient.adverseEventsNoted],
        ['Adverse Events Reason', patient.adverseEventsReason],
        ['Radiological Response', patient.radiologicalResponse],
        ['Pathological Response', patient.pathologicalResponse.pcr],
        ['Types Of Surgery', patient.typesOfSurgery],
        ['Relapse', patient.relapse],
        ['Site Of Relapse', patient.siteOfRelapse],
        ['Distant Relapse Site', patient.distantRelapseSite],
        ['Disease Free Survival', patient.diseaseFreeSurvival],
        ['Overall Survival', patient.overallSurvival],
        ['Date Created', new Date(patient.createdAt).toLocaleString()],
      ],
    });
    if (chemoData.length > 0) {
      doc.text("NEOADUVANT CHEMO-THERAPY", 14, doc.lastAutoTable.finalY + 10);
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 15,
        head: [['Treatment', 'Date', 'Clinical Examination']],
        body: chemoData,
      });
    }
    doc.save(`Patient_Record_${patient.patientId}.pdf`);
  };

  const patientColumns = [
    { name: 'ID', selector: (row, index) => index + 1, sortable: true, width: '80px' },
    { name: 'Patient Name', selector: row => row.patientName, sortable: true },
    { name: 'Unique Patient ID', selector: row => row.uniquePatientId, sortable: true },
    { name: 'CNIC', selector: row => row.cnic, sortable: true },
    { name: 'Date Of Diagnosis', selector: row => new Date(row.dateOfDiagnosis).toLocaleDateString(), sortable: true },
    { name: 'Tumor Size', selector: row => row.tumorSize, sortable: true },
    { name: 'Date Created', selector: row => new Date(row.createdAt).toLocaleString(), sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <div>
         
          <Button variant="danger" size="sm" onClick={() => handleDeletePatient(row._id)} title="Delete" className="me-2">
            <FaTrash />
          </Button>
          <Button variant="info" size="sm" onClick={() => generatePDF(row)} title="Print">
            <FaPrint />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '150px',
    },
  ];

  return (
    <Container className="my-5">
      <Card className="vibrant-card mt-5">
        <Card.Body>
          <Card.Title className="text-center my-5 dash"><p>All Submissions</p></Card.Title>
          <Button className="btn-vibrant mb-4" onClick={() => navigate('/home')}>
            Back to Dashboard
          </Button>
          {loading ? (
            <p>Loading patient records...</p>
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : patients.length === 0 ? (
            <p>No patient records found. Yet to Add a Record</p>
          ) : (
            <DataTable
              columns={patientColumns}
              data={patients}
              pagination
              highlightOnHover
              striped
              className="vibrant-datatable"
            />
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default AllSubmissions;