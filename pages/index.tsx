// pages/index.tsx
import Head from 'next/head';
// import MyPage from '../components/MyPage';
import Header from '../components/Header'
import HeroSection from '@/components/HeroSection';
import LearningLibrary from '@/components/LearningLibrary';
import UnlockSection from '@/components/UnlockSection';
import CommunitySection from '@/components/CommunitySection';
import EducationSection from '@/components/EducationSection';
import GetAccessSection from '@/components/GetAccessSection';
const Home = () => {
    return (
        <div>
            <Head>
                <title>IGNYTO SOLUTIONS</title>
                <meta name="description" content="IGNYTO SOLUTIONS WORKSHEETS" />
            </Head>
            <Header />                        
            <HeroSection />
            <LearningLibrary />  
            <UnlockSection />    
            <CommunitySection />   
            <EducationSection />  
            <GetAccessSection />                  
        </div>
    );
};

export default Home;
