// client/src/components/Home.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Form, Card, Row, Col, Container } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FaEdit, FaTrash, FaPrint } from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAllAccounts, setShowAllAccounts] = useState(false);
  const [searchCnic, setSearchCnic] = useState('');
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchPatients(token);
      fetchTotalSubmissions();
    } else {
      navigate('/');
    }
  }, [navigate]);

  const fetchPatients = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/patient/records', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedPatients = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPatients(sortedPatients);
      setFilteredPatients(sortedPatients);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchAllUsers = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setShowAllAccounts(true);
    } catch (error) {
      console.error('Error fetching all users:', error);
      alert('Failed to fetch all accounts');
    }
  };

  const fetchTotalSubmissions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/patient/total');
      setTotalSubmissions(response.data.total);
    } catch (error) {
      console.error('Error fetching total submissions:', error);
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
        setFilteredPatients(updatedPatients.filter(patient =>
          patient.cnic.toLowerCase().includes(searchCnic.toLowerCase())
        ));
        fetchTotalSubmissions();
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Failed to delete patient: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This will also delete their patient records.')) {
      const token = localStorage.getItem('token');
      try {
        await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const updatedUsers = users.filter(user => user._id !== id);
        setUsers(updatedUsers);
        fetchPatients(token); // Refresh patient records
        fetchTotalSubmissions(); // Update total submissions
        alert('User and their patient records deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchCnic(value);
    const filtered = patients.filter(patient =>
      patient.cnic.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  const handleShowAllAccounts = (token) => {
    fetchAllUsers(token);
    setSearchCnic('');
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
      headStyles: { fontSize: 12 }, // Increase table header font size
      bodyStyles: { fontSize: 10, cellPadding: 4 }, // Increase
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
        ['Adjuvant Treatment', patient.adjuvantTreatment],
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
          <Button variant="warning" size="sm" as={Link} to={`/edit-record/${row._id}`} className="me-2" title="Edit">
            <FaEdit />
          </Button>
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

  const userColumns = [
    { name: 'ID', selector: (row, index) => index + 1, sortable: true, width: '80px' },
    { name: 'Username', selector: row => row.username, sortable: true },
    { name: 'Email', selector: row => row.email, sortable: true },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <Button variant="warning" size="sm" as={Link} to={`/edit-user/${row._id}`} className="me-2" title="Edit">
            <FaEdit />
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDeleteUser(row._id)} title="Delete">
            <FaTrash />
          </Button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: '120px',
    },
  ];

  return (
    <Container className="my-5">
      {isLoggedIn ? (
        <Card className="vibrant-card mt-5">
          <Card.Body>
            <Card.Title className="text-center my-5 dash"><p>DASHBOARD:</p></Card.Title>
            <Row className="mb-4 justify-content-between">
              <Col md={4}>
                <Card className="stats-card text-center">
                  <Card.Body>
                    <Card.Text className="test"><strong>Your Submissions:</strong> {patients.length}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="stats-card text-center">
                  <Card.Body>
                    <Card.Text className="test"><strong>Total Submissions:</strong> {totalSubmissions}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <hr />
            <Button className="btn-vibrant mb-4 d-flex justify-content-center" as={Link} to="/add-record">
              + Add New Record
            </Button>
            <Button className="btn-vibrant mb-4 d-flex justify-content-center w-100" onClick={() => { setShowAllAccounts(false); setSearchCnic(''); }}>
              My Registry
            </Button>
            <Button className="btn-vibrant mb-4 d-flex justify-content-center w-100" onClick={() => handleShowAllAccounts(localStorage.getItem('token'))}>
              All Accounts
            </Button>
            {showAllAccounts ? (
              <DataTable
                columns={userColumns}
                data={users}
                pagination
                highlightOnHover
                striped
                defaultSortFieldId={1}
                defaultSortAsc={false}
                className="vibrant-datatable"
              />
            ) : (
              <>
                <Form.Group className="mx-4 my-3 w-100 section-cnic" style={{ maxWidth: '300px' }}>
                  <Form.Label>Search by CNIC</Form.Label>
                  <Form.Control type="text" placeholder="Enter CNIC" value={searchCnic} onChange={handleSearch} />
                </Form.Group>
                <hr className="w-100" />
                <DataTable
                  columns={patientColumns}
                  data={filteredPatients}
                  pagination
                  highlightOnHover
                  striped
                  className="vibrant-datatable"
                />
              </>
            )}
            <hr />
          </Card.Body>
        </Card>
      ) : (
        <p className="text-center">Please log in to view this page.</p>
      )}
    </Container>
  );
}

export default Home;