package com.example.campus_pay.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.dynamicDarkColorScheme
import androidx.compose.material3.dynamicLightColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

// Define the Light Color Scheme for Campus Pay
private val LightColorScheme = lightColorScheme(
    primary = BlueMain,
    onPrimary = White,
    primaryContainer = BlueLight,
    onPrimaryContainer = BlueDark,

    secondary = TealMain,
    onSecondary = White,
    secondaryContainer = TealLight,
    onSecondaryContainer = TealDark,

    tertiary = AmberMain,
    onTertiary = Black,
    tertiaryContainer = AmberLight,
    onTertiaryContainer = AmberDark,

    error = ErrorMain,
    onError = White,
    errorContainer = ErrorLight,
    onErrorContainer = ErrorDark,

    background = Gray100, // A soft, off-white background
    onBackground = Gray900, // Dark text for high contrast

    surface = White, // Cards and dialogs are slightly brighter than the background
    onSurface = Gray900,

    surfaceVariant = Gray200,
    onSurfaceVariant = Gray700,

    outline = Gray400
)

// Define the Dark Color Scheme for Campus Pay
private val DarkColorScheme = darkColorScheme(
    primary = BlueLight,
    onPrimary = BlueDark,
    primaryContainer = BlueDark,
    onPrimaryContainer = BlueLight,

    secondary = TealLight,
    onSecondary = TealDark,
    secondaryContainer = TealDark,
    onSecondaryContainer = TealLight,

    tertiary = AmberLight,
    onTertiary = AmberDark,
    tertiaryContainer = AmberDark,
    onTertiaryContainer = AmberLight,

    error = ErrorLight,
    onError = ErrorDark,
    errorContainer = ErrorDark,
    onErrorContainer = ErrorLight,

    background = Gray900, // A very dark gray, not pure black
    onBackground = Gray200, // Light gray text

    surface = Gray800, // Cards and dialogs are slightly lighter than the background
    onSurface = Gray200,

    surfaceVariant = Gray700,
    onSurfaceVariant = Gray400,

    outline = Gray600
)

@Composable
fun Campus_payTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    // Dynamic color is available on Android 12+
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context) else dynamicLightColorScheme(context)
        }

        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = darkTheme
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}