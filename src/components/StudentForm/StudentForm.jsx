import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import styles from './StudentForm.module.css';

// Opciones para los dropdowns
const GRUPOS_OPTIONS = ["3a5", "6a8", "9a12", "13a16"];
const GENERO_OPTIONS = ["masculino", "femenino"];

const StudentForm = ({ studentData, onClose, onSave, isSaving }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (studentData) {
      // Estructura completa con datos separados del representante
      const fullData = {
        estudiante: studentData.student,
        representante: studentData.representante
      };
      setFormData(fullData);
      setOriginalData(fullData);
    }
  }, [studentData]);

  const handleInputChange = (path, value) => {
    setFormData(prev => ({
      ...prev,
      [path]: {
        ...prev[path],
        ...value
      }
    }));
  };



  const handleSave = async () => {
    const updatedData = {
      ...studentData.representante,
      ...formData.representante,
      repeatable_fields_group_start: studentData.representante.repeatable_fields_group_start.map(
        (estudiante, index) => index === studentData.studentIndex ? formData.estudiante : estudiante
      )
    };
    try {
      await onSave(updatedData);
    } finally {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  if (!studentData) return null;

  return (
    <div className={styles.formContainer}>
      <div className={styles.formHeader}>
        <h2>Detalles del Estudiante</h2>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className={styles.formSections}>
        {/* Sección Estudiante */}
        <div className={styles.section}>
          <h3><span className={styles.sectionIcon}>👤</span> Información del Estudiante</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Cédula Estudiante:</label>
              <input 
                value={formData.estudiante?.cedula_estudiante || ''}
                onChange={(e) => handleInputChange('estudiante', { cedula_estudiante: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Nombres:</label>
              <input 
                value={formData.estudiante?.nombres_estudiante || ''}
                onChange={(e) => handleInputChange('estudiante', { nombres_estudiante: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Apellidos:</label>
              <input 
                value={formData.estudiante?.apellidos_estudiante || ''}
                onChange={(e) => handleInputChange('estudiante', { apellidos_estudiante: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Fecha Nacimiento:</label>
              <input 
                type="date"
                value={formData.estudiante?.nacimiento_estudiante?.split('T')[0] || ''}
                onChange={(e) => handleInputChange('estudiante', { nacimiento_estudiante: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Género:</label>
              <select 
                value={formData.estudiante?.genero_estudiante || ''}
                onChange={(e) => handleInputChange('estudiante', { genero_estudiante: e.target.value })}
                disabled={!isEditing}
              >
                {GENERO_OPTIONS.map(opcion => (
                  <option key={opcion} value={opcion}>{opcion.charAt(0).toUpperCase() + opcion.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Grupo:</label>
              <select 
                value={formData.estudiante?.grupo_estudiante || ''}
                onChange={(e) => handleInputChange('estudiante', { grupo_estudiante: e.target.value })}
                disabled={!isEditing}
              >
                {GRUPOS_OPTIONS.map(grupo => (
                  <option key={grupo} value={grupo}>{grupo}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Sección Salud */}
        <div className={styles.section}>
          <h3><span className={styles.sectionIcon}>❤️</span> Información de Salud</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Enfermedades:</label>
              <textarea 
                value={formData.estudiante?.padece_enfermedad_estudiante || ''}
                onChange={(e) => handleInputChange('estudiante', { padece_enfermedad_estudiante: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Medicamentos:</label>
              <textarea 
                value={formData.estudiante?.toma_medicamento_estudiante || ''}
                onChange={(e) => handleInputChange('estudiante', { toma_medicamento_estudiante: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Cuidados Especiales:</label>
              <textarea 
                value={formData.estudiante?.cuidado_estudiante || ''}
                onChange={(e) => handleInputChange('estudiante', { cuidado_estudiante: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Sección Representante */}
        <div className={styles.section}>
          <h3><span className={styles.sectionIcon}>👨👩</span> Información del Representante</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Cédula Representante:</label>
              <input 
                value={formData.representante?.cedula_representante || ''}
                onChange={(e) => handleInputChange('representante', { cedula_representante: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Nombres:</label>
              <input 
                value={formData.representante?.nombres_representante || ''}
                onChange={(e) => handleInputChange('representante', { nombres_representante: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Apellidos:</label>
              <input 
                value={formData.representante?.apellidos_representante || ''}
                onChange={(e) => handleInputChange('representante', { apellidos_representante: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Celular:</label>
              <input 
                value={formData.representante?.celular_representante || ''}
                onChange={(e) => handleInputChange('representante', { celular_representante: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Correo:</label>
              <input 
                type="email"
                value={formData.representante?.correo_representante || ''}
                onChange={(e) => handleInputChange('representante', { correo_representante: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
      {!isEditing ? (
        <button className={styles.editButton} onClick={() => setIsEditing(true)}>
          <FaEdit /> Editar
        </button>
      ) : (
        <>
          <button 
            className={styles.cancelButton} 
            onClick={handleCancel}
            disabled={isSaving}
          >
            <FaTimes /> Cancelar
          </button>
          <button 
            className={styles.saveButton} 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              'Guardando...'
            ) : (
              <>
                <FaSave /> Guardar Cambios
              </>
            )}
          </button>
        </>
      )}
    </div>


    </div>
  );
};

export default StudentForm;