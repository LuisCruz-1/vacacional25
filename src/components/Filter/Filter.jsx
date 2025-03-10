import React, { useState, useEffect } from 'react';
import styles from './Filter.module.css';
import { FaFilter, FaSearch, FaDownload } from 'react-icons/fa';

const GRUPOS_OPTIONS_FILTER = ["Todos", "3a5", "6a8", "9a12", "13a16"];

const normalizeGroupData = (groupData) => {
  if (Array.isArray(groupData)) return groupData;
  if (typeof groupData === "object" && groupData !== null) return Object.values(groupData);
  return [];
};

const Filter = ({ data, onFilter }) => {
  const [selectedGroup, setSelectedGroup] = useState("Todos");
  const [searchText, setSearchText] = useState('');
  const [filteredItemCount, setFilteredItemCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const applyFilters = () => {
      let filteredData;

      if (selectedGroup !== "Todos") {
        filteredData = data
          .map(record => {
            const normalized = normalizeGroupData(record.repeatable_fields_group_start);
            const filteredItems = normalized.filter(item => item.grupo_estudiante === selectedGroup);
            return { ...record, repeatable_fields_group_start: filteredItems };
          })
          .filter(record => record.repeatable_fields_group_start.length > 0);
      } else {
        filteredData = data.map(record => {
          const normalized = normalizeGroupData(record.repeatable_fields_group_start);
          return { ...record, repeatable_fields_group_start: normalized };
        });
      }

      if (searchText) {
        const lowerSearchText = searchText.toLowerCase();
        filteredData = filteredData.filter(record => {
          const repMatch =
            record.nombres_representante.toLowerCase().includes(lowerSearchText) ||
            record.apellidos_representante.toLowerCase().includes(lowerSearchText) ||
            record.cedula_representante.toLowerCase().includes(lowerSearchText) ||
            record.correo_representante.toLowerCase().includes(lowerSearchText) ||
            record.celular_representante.toLowerCase().includes(lowerSearchText);

          const studentMatch = record.repeatable_fields_group_start.some(student =>
            student.nombres_estudiante.toLowerCase().includes(lowerSearchText) ||
            student.apellidos_estudiante.toLowerCase().includes(lowerSearchText) ||
            student.cedula_estudiante.toLowerCase().includes(lowerSearchText)
          );

          return repMatch || studentMatch;
        });
      }

      const totalItems = filteredData.reduce(
        (acc, record) => acc + record.repeatable_fields_group_start.length,
        0
      );
      setFilteredItemCount(totalItems);
      onFilter(filteredData);
    };

    applyFilters();
  }, [selectedGroup, searchText, data, onFilter]);

  const handleDownload = async (type) => {
    const url = type === 'excel' 
      ? 'https://kapk4f.buildship.run/untitledFlow-9f66a1f7ffba' 
      : 'https://kapk4f.buildship.run/pdfFichaAlumnosVacacional2025-e386858bf08e';
  
    try {
      const response = await fetch(url);
      const downloadUrl = await response.text(); // Obtiene el string de la URL directamente
      window.location.href = downloadUrl; // Redirige automáticamente para descargar
    } catch (error) {
      console.error('Error al obtener la URL de descarga:', error);
    }
  };
  
  return (
    <div className={styles.filterContainer}>
      <div className={styles.filterGroup}>
        <FaFilter className={styles.filterIcon} />
        <label htmlFor="grupoFilter" className={styles.filterLabel}>
          Grupo:
        </label>
        <select
          id="grupoFilter"
          className={styles.filterSelect}
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          {GRUPOS_OPTIONS_FILTER.map(grupo => (
            <option key={grupo} value={grupo}>{grupo}</option>
          ))}
        </select>
      </div>

      <div className={styles.searchGroup}>
        <FaSearch className={styles.searchIcon} />
        <label htmlFor="searchText" className={styles.searchLabel}>
          Buscar:
        </label>
        <input
          type="text"
          id="searchText"
          className={styles.searchInput}
          placeholder="Buscar estudiante o representante..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <div className={styles.downloadGroup}>
        <button className={styles.downloadButton} onClick={() => setShowDropdown(!showDropdown)}>
          <FaDownload /> Descargar
        </button>
        {showDropdown && (
          <div className={styles.dropdownMenu}>
            <button onClick={() => handleDownload('excel')}>Reporte Excel</button>
            <button onClick={() => handleDownload('pdf')}>Fichas PDF</button>
          </div>
        )}
      </div>

      <div className={styles.itemCount}>
        {filteredItemCount > 0 ? `${filteredItemCount} Items` : 'Cargando items...'}
      </div>
    </div>
  );
};

export default Filter;
