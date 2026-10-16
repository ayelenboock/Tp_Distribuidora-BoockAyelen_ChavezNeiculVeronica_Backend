const manejoErrores = (err, req, res, next) => {
    console.error(err);

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: 'El registro ya existe' });        
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'El registro relacionado no existe' });
    }

    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ error: 'No se puede eliminar el registro porque está siendo usado en otra tabla' });
    }
    
    if (err.status) {
        return res.status(err.status).json({ error: err.message });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
}

export default manejoErrores;