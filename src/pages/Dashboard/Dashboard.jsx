// src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Menu from '../../components/Menu/Menu';
import DataTable from '../../components/DataTable/DataTable';
import StudentForm from '../../components/StudentForm/StudentForm';
import Filter from '../../components/Filter/Filter'; // Actualizado
import { getVacacionalData, updateVacacionalData } from '../../services/api';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]); // Datos filtrados
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getVacacionalData();
                setData(response);
                setFilteredData(response);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSaveStudent = async (updatedData) => {
        setIsSaving(true);
        try {
            await updateVacacionalData(updatedData._ID, updatedData);
            const refreshedData = await getVacacionalData();
            setData(refreshedData);
            setFilteredData(refreshedData);
            setSelectedStudent(null);
        } catch (error) {
            console.error('Error al guardar:', error);
            setError('Error al guardar los cambios');
        } finally {
            setIsSaving(false);
        }
    };

    // useCallback para evitar renderizados innecesarios
    const handleFilterData = useCallback((filteredDataFromFilter) => {
        setFilteredData(filteredDataFromFilter);
    }, [setFilteredData]);

    return (
        <div className={styles.dashboardContainer}>
            <Menu />
            <div className={styles.mainContent}>
                {isLoading && <div>Cargando...</div>}
                {error && <div className={styles.error}>Error: {error}</div>}
                {!isLoading && !error && (
                    <>
                        {/* Se muestra el filtro solo si no hay un estudiante seleccionado */}
                        {!selectedStudent && <Filter data={data} onFilter={handleFilterData} />}
                        {selectedStudent ? (
                            <StudentForm
                                studentData={selectedStudent}
                                onClose={() => setSelectedStudent(null)}
                                onSave={handleSaveStudent}
                                isSaving={isSaving}
                            />
                        ) : (
                            <DataTable data={filteredData} onViewStudent={setSelectedStudent} />
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
