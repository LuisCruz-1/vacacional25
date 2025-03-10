import React from 'react';
import styles from './Menu.module.css';
import logo from '../../assets/iconANAVI.png'

const Menu = () => {
  return (
    <header className={styles.menuContainer}>
      <div className={styles.logo}>
        <img src={logo} alt="" />
        Colegio ANAVI - Vacacional</div>
    </header>
  );
};

export default Menu;