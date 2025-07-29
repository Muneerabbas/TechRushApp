package com.example.campus_pay.ui.screens.homeScreen

import androidx.compose.animation.core.spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Payment
import androidx.compose.material.icons.filled.Person
import androidx.compose.ui.graphics.graphicsLayer

@Composable
fun NavBar(
    onItemSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var selectedItem by remember { mutableStateOf("Home") }

    // Navigation items
    val items = listOf(
        Triple("Home", Icons.Filled.Home, "Home"),
        Triple("Payments", Icons.Filled.Payment, "Payments"),
        Triple("Profile", Icons.Filled.Person, "Profile")
    )

    NavigationBar(
        modifier = modifier
            .height(72.dp)
            .padding(horizontal = 12.dp, vertical = 6.dp)
            .clip(RoundedCornerShape(50.dp))
            .shadow(4.dp, RoundedCornerShape(50.dp)),
        contentColor = Color.White
    ) {
        items.forEach { (label, icon, route) ->
            // Animation for scale effect on selection
            val scale by animateFloatAsState(
                targetValue = if (selectedItem == route) 1.2f else 1f,
                animationSpec = spring(dampingRatio = 0.8f, stiffness = 1000f),
                label = "scale"
            )

            NavigationBarItem(
                icon = {
                    Icon(
                        imageVector = icon,
                        contentDescription = label,
                        modifier = Modifier
                            .size(26.dp)
                            .graphicsLayer(scaleX = scale, scaleY = scale),
                        tint = if (selectedItem == route) Color(0xFF0D47A1) else Color.Gray,
                    )
                },
                selected = selectedItem == route,
                onClick = {
                    selectedItem = route
                    onItemSelected(route)
                }
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun NavBarPreview() {
    MaterialTheme {
        NavBar(
            onItemSelected = { route -> println("Selected: $route") }
        )
    }
}