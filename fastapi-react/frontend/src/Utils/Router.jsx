import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RatingPtInfo from '../Components/PersonalTrainer/PtInfo/RatingPtInfo';
import OtherPtInfo from '../Components/PersonalTrainer/PtInfo/OtherPtInfo';
import Subscription from "../Pages/Subscription/Subscription";
import Progress from "../Pages/Progress/Progress";
import NewPtTable from "../Pages/Subscription/NewPtTable";
import VideoPlayer from '../Pages/VideoPlayer/VideoPlayer';
import LoginForm from '../Pages/Login/LoginForm';
import RegisterForm from '../Pages/Register/RegisterForm';
import Sign from '../Layouts/Sign';
import PtSubPage from '../Pages/PersonalTrainer/PtSubPage';
import MainPtInfo from '../Components/PersonalTrainer/PtInfo/MainPtInfo';
import PtMainPageView from '../Pages/PersonalTrainer/PtMainPageView';
import PtMainPage from '../Pages/PersonalTrainer/PtMainPage';
import BGPtInfo from '../Components/PersonalTrainer/PtInfo/BGPtInfo';
import Settings from '../Pages/Settings/Settings';
import RegisterBasic from '../Components/Register/RegisterBasic';
import RegisterPt from '../Components/Register/RegisterPt';
import RegisterPtDetails from '../Components/Register/RegisterPtDetails';
import Home from "../Pages/Home/Home";
import Chat from '../Pages/Chat/Chat';
import Base from "../Layouts/Base";
import ChatCards from '../Pages/Chat/ChatCards';

export default function Router() {
    const router = createBrowserRouter([
        {
            path: '/', element: <Base />, children: [
                { path: '/', element: <Home /> },
                { path: '/subscriptions', element: <Subscription />, },
                { path: '/AvaliblePT', element: <NewPtTable /> },
                { path: '/progress', element: <Progress /> },
                { path: '/settings', element: <Settings /> },
                { path: '/chat', element: <ChatCards /> },
                { path: '/chat/:id', element: <Chat /> },
                { path: '/PT_sub/:id', element: <PtMainPageView /> },
                /* por questões de segurança isto não deve ficar assim */ { path: '/PT/:id', element: <PtMainPage />},

                {
                    path: '/PT_nonSub/:id/', element: <PtSubPage />, children: [
                        { path: 'main', element: <MainPtInfo /> },
                        { path: 'bg', element: <BGPtInfo /> },
                        { path: 'other', element: <OtherPtInfo /> },
                        { path: 'rating', element: <RatingPtInfo /> },
                    ]
                },

                { path: '/video/:WorkoutID', element: <VideoPlayer /> }
            ]
        },
        {
            path: '/', element: <Sign />, children: [
                { path: '/login', element: <LoginForm /> },
                {
                    path: '/register', element: <RegisterForm />, children: [
                        { path: '/register/athlete', element: <RegisterBasic /> },
                        { path: '/register/trainer', element: <RegisterPt /> },
                        { path: '/register/trainer/details', element: <RegisterPtDetails /> }
                    ]
                },
            ]
        },
    ]);

    return <RouterProvider router={router} />;
}
