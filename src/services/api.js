export const getVacacionalData = async () => {
  try {
    const response = await fetch('https://anavi.edu.ec/wp-json/jet-cct/vacacional');
    
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
};

export const updateVacacionalData = async (id, data) => {
  try {
    const response = await fetch(`https://anavi.edu.ec/wp-json/jet-cct/vacacional/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('LuisCruz:GJ4R Na82 eNXx 4RGn 7xHg GMmr')
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error actualizando datos:', error);
    throw error;
  }
};