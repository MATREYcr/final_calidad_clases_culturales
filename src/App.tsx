import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu, theme, Typography } from 'antd';
import { HomeOutlined, ReadOutlined, UsergroupAddOutlined } from '@ant-design/icons';


import './App.css';
import CulturalClassesPage from './pages/CulturalClasses';
import EnrollmentsPage from './pages/Enrollments';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Router>
      <Layout className="main-layout">
        <Header className="main-header">
          <div className="app-logo">
            <Link to="/">
              Gestión Cultural
            </Link>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            className="app-menu"
          >
            <Menu.Item key="1" icon={<HomeOutlined />}>
              <Link to="/">Inicio</Link>
            </Menu.Item>
            <Menu.Item key="2" icon={<ReadOutlined />}>
              <Link to="/classes">Clases Culturales</Link>
            </Menu.Item>
            <Menu.Item key="3" icon={<UsergroupAddOutlined />}>
              <Link to="/enrollments">Inscripciones</Link>
            </Menu.Item>
          </Menu>
        </Header>

        <Content className="main-content">
          <div
            className="content-wrapper"
            style={{
              background: colorBgContainer,
              borderRadius: theme.useToken().token.borderRadiusLG,
            }}
          >
            <Routes>
              <Route path="/classes" element={<CulturalClassesPage />} />
              <Route path="/enrollments" element={<EnrollmentsPage />} />
              <Route
                path="/"
                element={
                  <div className="welcome-section">
                    <Title level={2}>Bienvenido al Sistema de Gestión de Clases Culturales</Title>
                    <p>Usa el menú superior para navegar entre las secciones.</p>
                  </div>
                }
              />
            </Routes>
          </div>
        </Content>

        <Footer className="main-footer">
          Sistema de Gestión de Clases Culturales ©{new Date().getFullYear()} Creado con Ant Design
        </Footer>
      </Layout>
    </Router>
  );
}

export default App;