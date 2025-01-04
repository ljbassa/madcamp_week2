const pool = require('../../config/create_db'); // MySQL 연결

// 모든 사용자 가져오기
exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch users.' });
    }
};

// 특정 사용자 가져오기
exports.getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('Error fetching user:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch user.' });
    }
};

// 사용자 삭제
exports.deleteUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        res.json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
};