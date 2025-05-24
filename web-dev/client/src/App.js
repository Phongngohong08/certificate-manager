import React, { useState } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [tab, setTab] = useState('login');
  const [userType, setUserType] = useState('student');
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/${userType}/register`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setResult(await res.json());
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const url = `${API_URL}/${userType}/login`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setResult(await res.json());
  };

  return (
    <div className="App">
      <h1>Blockchain Academic Certificates</h1>
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setTab('login')}>Đăng nhập</button>
        <button onClick={() => setTab('register')}>Đăng ký</button>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label>
          <input type="radio" name="userType" value="student" checked={userType === 'student'} onChange={() => setUserType('student')} />
          Sinh viên
        </label>
        <label style={{ marginLeft: 10 }}>
          <input type="radio" name="userType" value="university" checked={userType === 'university'} onChange={() => setUserType('university')} />
          Trường đại học
        </label>
      </div>
      {tab === 'register' && (
        <form onSubmit={handleRegister} className="form-box">
          <h2>Đăng ký {userType === 'student' ? 'Sinh viên' : 'Trường đại học'}</h2>
          <input name="name" placeholder="Tên" onChange={handleChange} required />
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} required />
          {userType === 'university' && (
            <>
              <input name="description" placeholder="Mô tả" onChange={handleChange} required />
              <input name="location" placeholder="Địa chỉ" onChange={handleChange} required />
            </>
          )}
          <button type="submit">Đăng ký</button>
        </form>
      )}
      {tab === 'login' && (
        <form onSubmit={handleLogin} className="form-box">
          <h2>Đăng nhập {userType === 'student' ? 'Sinh viên' : 'Trường đại học'}</h2>
          <input name="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Mật khẩu" onChange={handleChange} required />
          <button type="submit">Đăng nhập</button>
        </form>
      )}
      {result && (
        <div className="result-box">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
