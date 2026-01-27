import { Stack, useTheme } from "@mui/material";
import FolderIcon from '@mui/icons-material/Folder';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import DownloadIcon from '@mui/icons-material/Download';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import styles from "@/scss/styles/HomePage/HomeTop.module.scss";
import { useContext } from "react";
import { ColorModeContext } from "@/pages/_app";

const HomeTop = () => {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    return (
        <Stack className={`${styles.container} ${styles[theme.palette.mode]}`}>
            {/* Left: Navigation & Context */}
            <div className={styles.leftSection}>
                {/* Tab Group */}
                <div className={styles.tabGroup}>
                    <button className={`${styles.tab} ${styles.active}`}>Product Visuals</button>
                    <button className={styles.tab}>Ad Recreation</button>
                </div>

                {/* Dropdown Context */}
                <div className={styles.dropdown}>
                    <FolderIcon fontSize="small" />
                    <span>SS26</span>
                    <ArrowDropDownIcon fontSize="small" />
                </div>
            </div>

            {/* Center: Status Indicator */}
            <div className={styles.centerSection}>
                <div className={styles.statusPill}>
                    <span className={styles.statusDot}></span>
                    Generating 4/6...
                </div>
            </div>

            {/* Right: Actions */}
            <div className={styles.rightSection}>
                {/* Theme Toggle */}
                <div
                    className={`${styles.iconButton} ${styles.highlight}`}
                    onClick={colorMode.toggleColorMode}
                >
                    {theme.palette.mode === 'dark' ? (
                        <WbSunnyIcon fontSize="small" />
                    ) : (
                        <NightlightRoundIcon fontSize="small" />
                    )}
                </div>
                <div className={styles.iconButton}>
                    <ViewStreamIcon fontSize="small" />
                </div>
                <div className={styles.iconButton}>
                    <DownloadIcon fontSize="small" />
                </div>
                <div className={styles.iconButton}>
                    <AccountCircleIcon fontSize="small" />
                </div>
            </div>
        </Stack>
    )
}

export default HomeTop;