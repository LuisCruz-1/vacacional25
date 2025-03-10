import React, { useState } from "react";
import { FaInfoCircle, FaCalendarAlt, FaUser, FaEye } from "react-icons/fa";
import styles from "./DataTable.module.css";

const DataTable = ({ data, onViewStudent }) => {
  const [expandedStudent, setExpandedStudent] = useState(null);

  const normalizeGroupData = (groupData) => {
    if (Array.isArray(groupData)) return groupData;
    if (typeof groupData === "object" && groupData !== null) return Object.values(groupData);
    return [];
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }

    if (days < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, birth.getDate());
      days = Math.floor((today - lastMonth) / (1000 * 60 * 60 * 24));
      months--;
    }

    return `${years} años ${months} meses ${days} días`;
  };

  // Función auxiliar para determinar si el valor es considerado "saludable"
  const isHealthy = (value) => {
    const healthyValues = ["no", "ninguna", "ninguno"];
    if (!value) return true; // Consideramos valores vacíos como saludables, o ajusta según necesites
    return healthyValues.includes(value.trim().toLowerCase());
  };

  // Actualizamos getHealthStatus para considerar los tres campos
  const getHealthStatus = (student) => {
    if (
      !isHealthy(student.padece_enfermedad_estudiante) ||
      !isHealthy(student.tiene_necesidad_especial) ||
      !isHealthy(student.toma_medicamento_estudiante) ||
      !isHealthy(student.cuidado_estudiante)
    ) {
      return "#ff4757"; // Color rojo para "Necesita atención"
    }
    return "#20bf6b"; // Color verde para "Salud OK"
  };

  // Generar una cadena de estado de salud para mostrar en el UI
  const getHealthText = (student) => {
    return isHealthy(student.padece_enfermedad_estudiante) &&
      isHealthy(student.tiene_necesidad_especial) &&
      isHealthy(student.cuidado_estudiante) &&
      isHealthy(student.toma_medicamento_estudiante)
      ? "Salud OK"
      : "Necesita atención";
  };

  const allStudents = data.flatMap((record) => {
    const groupData = record.repeatable_fields_group_start || {};
    return normalizeGroupData(groupData).map((student) => ({
      ...student,
      representante: `${record.nombres_representante} ${record.apellidos_representante}`,
      contacto: `${record.celular_representante} | ${record.correo_representante}`,
      edad: calculateAge(student.nacimiento_estudiante),
    }));
  });

  const handleRowClick = (studentId) => (e) => {
    if (!e.target.closest("button")) {
      setExpandedStudent(expandedStudent === studentId ? null : studentId);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Estudiantes Vacacional</h2>
      </div>

      <div className={styles.tableContainer}>
        {/* Desktop View */}
        <div className={styles.desktopView}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Edad</th>
                <th>Grupo</th>
                <th>Salud</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {allStudents.map((student) => (
                <React.Fragment key={`${student.cedula_estudiante}-${student.nombres_estudiante}`}>
                  <tr className={styles.mainRow} onClick={handleRowClick(student.cedula_estudiante)}>
                    <td>
                      <div className={styles.studentInfo}>
                        <div>
                          <div className={styles.name}>
                            {student.nombres_estudiante} {student.apellidos_estudiante}
                          </div>
                          <div className={styles.detail}>CI: {student.cedula_estudiante}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.age}>{student.edad}</div>
                    </td>
                    <td>
                      <div className={styles.groupBadge}>
                        <FaCalendarAlt className={styles.icon} />
                        {student.grupo_estudiante}
                      </div>
                    </td>
                    <td>
                      <div
                        className={styles.statusBadge}
                        style={{ backgroundColor: getHealthStatus(student) }}>
                        {getHealthText(student)}
                      </div>
                    </td>
                    <td className={styles.actions}>
                      <button
                        className={styles.viewButton}
                        onClick={() => {
                          const representanteRecord = data.find((rep) => {
                            const normalizedGroup = normalizeGroupData(rep.repeatable_fields_group_start);
                            return normalizedGroup.some(
                              (est) => est.cedula_estudiante === student.cedula_estudiante
                            );
                          });

                          const normalizedGroup = normalizeGroupData(
                            representanteRecord.repeatable_fields_group_start
                          );
                          const studentIndex = normalizedGroup.findIndex(
                            (est) => est.cedula_estudiante === student.cedula_estudiante
                          );

                          onViewStudent({
                            representante: representanteRecord,
                            student: student,
                            studentIndex: studentIndex,
                          });
                        }}>
                        <FaEye className={styles.icon} />
                      </button>
                    </td>
                  </tr>

                  {expandedStudent === student.cedula_estudiante && (
                    <tr className={styles.detailsRow}>
                      <td colSpan="5">
                        <div className={styles.detailsContent}>
                          <div className={styles.detailSection}>
                            <h4>
                              <FaInfoCircle className={styles.icon} /> Detalles Completos
                            </h4>
                            <div className={styles.detailGrid}>
                              <div>
                                <label>Fecha nacimiento:</label>
                                <span>{new Date(student.nacimiento_estudiante).toLocaleDateString()}</span>
                              </div>
                              <div>
                                <label>Género:</label>
                                <span>{student.genero_estudiante}</span>
                              </div>
                              <div>
                                <label>Representante:</label>
                                <span>{student.representante}</span>
                              </div>
                              <div>
                                <label>Contacto:</label>
                                <span>{student.contacto}</span>
                              </div>
                              <div>
                                <label>Enfermedad:</label>
                                <span>{student.padece_enfermedad_estudiante}</span>
                              </div>
                              <div>
                                <label>Medicamentos:</label>
                                <span>{student.toma_medicamento_estudiante || "Ninguno"}</span>
                              </div>
                              <div>
                                <label>Cuidados:</label>
                                <span>{student.cuidado_estudiante}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className={styles.mobileView}>
          {allStudents.map((student) => (
            <div
              key={`${student.cedula_estudiante}-${student.nombres_estudiante}`}
              className={styles.mobileCard}
              onClick={() =>
                setExpandedStudent(
                  expandedStudent === student.cedula_estudiante ? null : student.cedula_estudiante
                )
              }>
              <div className={styles.mobileCardHeader}>
                <div className={styles.mobileStudentInfo}>
                  <div className={styles.name}>
                    {student.nombres_estudiante} {student.apellidos_estudiante}
                  </div>
                  <div className={styles.detail}>CI: {student.cedula_estudiante}</div>
                </div>
                <button
                  className={styles.viewButton}
                  onClick={() => {
                    const representanteRecord = data.find((rep) => {
                      const normalizedGroup = normalizeGroupData(rep.repeatable_fields_group_start);
                      return normalizedGroup.some(
                        (est) => est.cedula_estudiante === student.cedula_estudiante
                      );
                    });

                    const normalizedGroup = normalizeGroupData(
                      representanteRecord.repeatable_fields_group_start
                    );
                    const studentIndex = normalizedGroup.findIndex(
                      (est) => est.cedula_estudiante === student.cedula_estudiante
                    );

                    onViewStudent({
                      representante: representanteRecord,
                      student: student,
                      studentIndex: studentIndex,
                    });
                  }}>
                  <FaEye className={styles.icon} />
                </button>
              </div>

              <div className={styles.mobileCardBody}>
                <div className={styles.mobileCardItem}>
                  <span className={styles.mobileLabel}>Edad:</span>
                  <span className={styles.mobileValue}>{student.edad}</span>
                </div>

                <div className={styles.mobileCardItem}>
                  <span className={styles.mobileLabel}>Grupo:</span>
                  <span className={styles.groupBadge}>
                    <FaCalendarAlt className={styles.icon} />
                    {student.grupo_estudiante}
                  </span>
                </div>

                <div className={styles.mobileCardItem}>
                  <span className={styles.mobileLabel}>Salud:</span>
                  <span className={styles.statusBadge} style={{ backgroundColor: getHealthStatus(student) }}>
                    {getHealthText(student)}
                  </span>
                </div>
              </div>

              {expandedStudent === student.cedula_estudiante && (
                <div className={styles.mobileDetailsSection}>
                  <h4>
                    <FaInfoCircle className={styles.icon} /> Detalles Completos
                  </h4>
                  <div className={styles.mobileDetailGrid}>
                    <div className={styles.mobileDetailItem}>
                      <label>Fecha nacimiento:</label>
                      <span>{new Date(student.nacimiento_estudiante).toLocaleDateString()}</span>
                    </div>
                    <div className={styles.mobileDetailItem}>
                      <label>Género:</label>
                      <span>{student.genero_estudiante}</span>
                    </div>
                    <div className={styles.mobileDetailItem}>
                      <label>Representante:</label>
                      <span>{student.representante}</span>
                    </div>
                    <div className={styles.mobileDetailItem}>
                      <label>Contacto:</label>
                      <span>{student.contacto}</span>
                    </div>
                    <div className={styles.mobileDetailItem}>
                      <label>Enfermedad:</label>
                      <span>{student.padece_enfermedad_estudiante}</span>
                    </div>
                    <div className={styles.mobileDetailItem}>
                      <label>Medicamentos:</label>
                      <span>{student.toma_medicamento_estudiante || "Ninguno"}</span>
                    </div>
                    <div className={styles.mobileDetailItem}>
                      <label>Cuidados:</label>
                      <span>{student.cuidado_estudiante || "Ninguno"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
