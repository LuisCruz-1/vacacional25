import React from 'react';
import styles from './Menu.module.css';

const Menu = () => {
  return (
    <header className={styles.menuContainer}>
      <div className={styles.logo}>
        <img src="/src/assets/iconANAVI.png" alt="" />
        Colegio ANAVI - Vacacional</div>
    </header>
  );
};

export default Menu;