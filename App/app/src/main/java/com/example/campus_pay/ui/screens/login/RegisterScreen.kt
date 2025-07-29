package com.example.campus_pay.ui.screens.register

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.ArrowDropUp
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import com.example.campus_pay.ui.components.CustomTextField
import com.example.campus_pay.ui.components.ProfileImageSection
import com.example.campus_pay.ui.screens.login.LoginViewModel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RegisterScreen(
    navController: NavController,
    onRegisterSuccess: () -> Unit,
    modifier: Modifier = Modifier
) {
    val viewModel: LoginViewModel = viewModel()
    val uiState by viewModel.uiState
    var passwordVisible by remember { mutableStateOf(false) }
    var confirmPassword by remember { mutableStateOf(uiState.confirmPassword) }
    val keyboardController = LocalSoftwareKeyboardController.current
    val scope = rememberCoroutineScope()

    // Animation state for card
    var isVisible by remember { mutableStateOf(false) }
    LaunchedEffect(Unit) {
        isVisible = true
    }

    // Professional gradient background
    val gradient = Brush.verticalGradient(
        colors = listOf(
            Color(0xFF0D47A1), // Navy blue
            Color(0xFF4FC3F7) // Light teal
        )
    )

    Scaffold(
        topBar = {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(80.dp),
                shape = RoundedCornerShape(bottomStart = 24.dp, bottomEnd = 24.dp),
                color = Color(0xFF0D47A1),
                shadowElevation = 8.dp
            ) {
                CenterAlignedTopAppBar(
                    title = {
                        Text(
                            text = "Campus Pay",
                            style = MaterialTheme.typography.headlineSmall.copy(fontSize = 26.sp),
                            color = Color.White,
                            maxLines = 1
                        )
                    },
                    navigationIcon = {
                        IconButton(onClick = {
                            if (navController.previousBackStackEntry != null) {
                                navController.popBackStack()
                            } else {
                                navController.navigate("login") {
                                    popUpTo("register") { inclusive = true }
                                }
                            }
                        }) {
                            Icon(
                                imageVector = Icons.Default.ArrowBack,
                                contentDescription = "Back",
                                tint = Color.White
                            )
                        }
                    },
                    colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                        containerColor = Color.Transparent
                    )
                )
            }
        },
        containerColor = Color.Transparent,
        modifier = modifier
    ) { padding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(gradient),
            contentAlignment = Alignment.Center
        ) {
            AnimatedVisibility(
                visible = isVisible,
                enter = fadeIn(animationSpec = tween(800)) + scaleIn(animationSpec = tween(800)),
                exit = fadeOut(animationSpec = tween(400))
            ) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth(0.9f)
                        .fillMaxHeight(0.75f)
                        .clip(RoundedCornerShape(24.dp))
                        .shadow(6.dp, RoundedCornerShape(24.dp)),
                    colors = CardDefaults.cardColors(
                        containerColor = Color.White
                    )
                ) {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        item {
                            // Title
                            Text(
                                text = "Register",
                                style = MaterialTheme.typography.headlineLarge.copy(
                                    fontWeight = FontWeight.SemiBold,
                                    fontSize = 28.sp
                                ),
                                color = Color(0xFF0D47A1),
                                textAlign = TextAlign.Center,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(bottom = 16.dp)
                            )
                        }

                        item {
                            // Profile Image
                            ProfileImageSection(viewModel = viewModel, isEditable = true)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "Profile photo is optional",
                                style = MaterialTheme.typography.bodySmall,
                                color = Color(0xFF0D47A1).copy(alpha = 0.6f)
                            )
                        }

                        item {
                            // Username Field
                            CustomTextField(
                                value = uiState.username,
                                onValueChange = { viewModel.updateUsername(it) },
                                label = "Username",
                                isError = uiState.username.isNotEmpty() && uiState.username.length < 3,
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        item {
                            // Email Field
                            CustomTextField(
                                value = uiState.email,
                                onValueChange = { viewModel.updateEmail(it) },
                                label = "Email",
                                isError = uiState.email.isNotEmpty() && !uiState.isEmailValid,
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        item {
                            // Password Field
                            CustomTextField(
                                value = uiState.password,
                                onValueChange = { viewModel.updatePassword(it) },
                                label = "Password",
                                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                                isError = uiState.password.isNotEmpty() && uiState.password.length < 6,
                                trailingIcon = {
                                    IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                        Icon(
                                            imageVector = if (passwordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                            contentDescription = if (passwordVisible) "Hide password" else "Show password",
                                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                    }
                                },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        item {
                            // Confirm Password Field
                            CustomTextField(
                                value = confirmPassword,
                                onValueChange = {
                                    confirmPassword = it
                                    viewModel.updateConfirmPassword(it)
                                },
                                label = "Confirm Password",
                                visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                                isError = confirmPassword.isNotEmpty() && confirmPassword != uiState.password,
                                trailingIcon = {
                                    if (confirmPassword.isNotEmpty() && confirmPassword != uiState.password) {
                                        Icon(
                                            imageVector = Icons.Default.Error,
                                            contentDescription = "Passwords do not match",
                                            tint = MaterialTheme.colorScheme.error
                                        )
                                    }
                                },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        item {
                            // Password Strength Indicator
                            PasswordStrengthIndicator(password = uiState.password)
                        }

                        item {
                            // Role Dropdown
                            RoleDropdown(
                                selectedRole = uiState.role,
                                onRoleSelected = { viewModel.updateRole(it) }
                            )
                        }

                        item {
                            // College/University Field
                            CustomTextField(
                                value = uiState.college,
                                onValueChange = { viewModel.updateCollege(it) },
                                label = "College/University",
                                isError = uiState.college.isNotEmpty() && uiState.college.length < 3,
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Text),
                                modifier = Modifier.fillMaxWidth()
                            )
                        }

                        item {
                            // Error Message
                            if (uiState.errorMessage.isNotEmpty()) {
                                Text(
                                    text = uiState.errorMessage,
                                    color = MaterialTheme.colorScheme.error,
                                    style = MaterialTheme.typography.bodyMedium,
                                    modifier = Modifier.padding(horizontal = 8.dp)
                                )
                            }
                        }

                        item {
                            // Sign Up Button
                            val interactionSource = remember { MutableInteractionSource() }
                            val isPressed by interactionSource.collectIsPressedAsState()
                            val buttonScale by animateFloatAsState(
                                targetValue = if (isPressed) 0.95f else 1f,
                                animationSpec = spring(),
                                label = "ButtonScale"
                            )

                            Button(
                                onClick = {
                                    keyboardController?.hide()
                                    if (viewModel.validateRegistration(confirmPassword)) {
                                        scope.launch {
                                            viewModel.showAlert("Registration successful!")
                                            delay(1000)
                                            onRegisterSuccess()
                                        }
                                    }
                                },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(60.dp)
                                    .clip(RoundedCornerShape(20.dp))
                                    .scale(buttonScale),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color(0xFF0D47A1),
                                    contentColor = Color.White
                                ),
                                interactionSource = interactionSource
                            ) {
                                Text(
                                    text = "Sign Up",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Medium
                                )
                            }
                        }
                    }
                }
            }
        }
    }

    // Alert Dialog for Success or Error
    if (uiState.showAlert) {
        AlertDialog(
            onDismissRequest = { viewModel.dismissAlert() },
            title = { Text("Registration Status") },
            text = { Text(uiState.alertMessage) },
            confirmButton = {
                TextButton(onClick = { viewModel.dismissAlert() }) {
                    Text("OK")
                }
            }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RoleDropdown(
    selectedRole: String,
    onRoleSelected: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    val roles = listOf("Student", "Teacher", "Other")

    ExposedDropdownMenuBox(
        expanded = expanded,
        onExpandedChange = { expanded = !expanded }
    ) {
        CustomTextField(
            value = selectedRole,
            onValueChange = {},
            label = "Role",
            trailingIcon = {
                Icon(
                    imageVector = if (expanded) Icons.Default.ArrowDropUp else Icons.Default.ArrowDropDown,
                    contentDescription = "Dropdown",
                    tint = Color(0xFF0D47A1)
                )
            },
            modifier = Modifier
                .fillMaxWidth()
                .menuAnchor(),
            readOnly = true
        )
        ExposedDropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false },
            modifier = Modifier.background(Color.White)
        ) {
            roles.forEach { role ->
                DropdownMenuItem(
                    text = { Text(role, style = MaterialTheme.typography.bodyLarge) },
                    onClick = {
                        onRoleSelected(role)
                        expanded = false
                    },
                    contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp)
                )
            }
        }
    }
}

@Composable
fun PasswordStrengthIndicator(password: String) {
    val strength = when {
        password.length >= 12 -> "Strong"
        password.length >= 8 -> "Medium"
        password.isNotEmpty() -> "Weak"
        else -> ""
    }
    val color = when (strength) {
        "Strong" -> Color(0xFF4CAF50)
        "Medium" -> Color(0xFFFFC107)
        "Weak" -> Color(0xFFF44336)
        else -> Color(0xFF0D47A1).copy(alpha = 0.5f)
    }

    if (strength.isNotEmpty()) {
        Text(
            text = "Password Strength: $strength",
            style = MaterialTheme.typography.bodySmall,
            color = color,
            modifier = Modifier.padding(horizontal = 8.dp)
        )
    }
}

@Preview(showBackground = true)
@Composable
fun RegisterScreenPreview() {
    MaterialTheme {
        RegisterScreen(
            navController = rememberNavController(),
            onRegisterSuccess = { println("Registration successful") }
        )
    }
}
