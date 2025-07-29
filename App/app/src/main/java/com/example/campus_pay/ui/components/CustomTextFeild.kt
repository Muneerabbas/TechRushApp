package com.example.campus_pay.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.ArrowDropUp
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.tooling.preview.PreviewLightDark
import androidx.compose.ui.unit.dp
import com.example.campus_pay.ui.theme.Campus_payTheme

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CustomTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    isError: Boolean = false,
    errorMessage: String? = null,
    helperText: String? = null,
    maxLength: Int? = null,
    prefixText: String? = null,
    suffixText: String? = null,
    leadingIcon: @Composable (() -> Unit)? = null,
    trailingIcon: @Composable (() -> Unit)? = null,
    visualTransformation: VisualTransformation = VisualTransformation.None,
    keyboardOptions: KeyboardOptions = KeyboardOptions.Default,
    readOnly: Boolean = false,
    dropdownItems: List<String> = emptyList(),
    onDropdownItemSelected: (String) -> Unit = {}
) {
    val fieldShape = RoundedCornerShape(30.dp)
    val interactionSource = remember { MutableInteractionSource() }
    val isPressed by interactionSource.collectIsPressedAsState()
    val scale by animateFloatAsState(
        targetValue = if (isPressed && !readOnly) 0.98f else 1f,
        animationSpec = spring(),
        label = "FieldScale"
    )
    var isDropdownExpanded by remember { mutableStateOf(false) }

    Column(modifier = modifier) {
        if (dropdownItems.isNotEmpty()) {
            ExposedDropdownMenuBox(
                expanded = isDropdownExpanded,
                onExpandedChange = { if (!readOnly) isDropdownExpanded = !isDropdownExpanded },
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(fieldShape)
                    .shadow(2.dp, fieldShape)
                    .background(
                        if (readOnly) Color(0xFF0D47A1).copy(alpha = 0.1f)
                        else Color(0xFF4FC3F7).copy(alpha = 0.1f)
                    )
                    .scale(scale)
            ) {
                OutlinedTextField(
                    value = value,
                    onValueChange = { if (!readOnly) onValueChange(it) },
                    label = { Text(label, fontWeight = FontWeight.Medium) },
                    isError = isError,
                    leadingIcon = leadingIcon,
                    trailingIcon = {
                        IconButton(onClick = { if (!readOnly) isDropdownExpanded = !isDropdownExpanded }) {
                            Icon(
                                imageVector = if (isDropdownExpanded) Icons.Default.ArrowDropUp else Icons.Default.ArrowDropDown,
                                contentDescription = if (isDropdownExpanded) "Collapse" else "Expand",
                                tint = Color(0xFF0D47A1)
                            )
                        }
                    },
                    visualTransformation = visualTransformation,
                    keyboardOptions = keyboardOptions,
                    readOnly = true,
                    shape = fieldShape,
                    colors = OutlinedTextFieldDefaults.colors(
                        unfocusedBorderColor = Color(0xFF0D47A1).copy(alpha = 0.6f),
                        focusedBorderColor = Color(0xFF0D47A1),
                        errorBorderColor = MaterialTheme.colorScheme.error,
                        focusedLabelColor = Color(0xFF0D47A1),
                        unfocusedLabelColor = Color(0xFF0D47A1).copy(alpha = 0.6f),
                        errorLabelColor = MaterialTheme.colorScheme.error,
                        cursorColor = Color(0xFF0D47A1),
                        focusedTextColor = Color.Black,
                        unfocusedTextColor = Color.Black,
                        disabledTextColor = Color.Black.copy(alpha = 0.6f),
                        disabledBorderColor = Color(0xFF0D47A1).copy(alpha = 0.3f),
                        disabledLabelColor = Color(0xFF0D47A1).copy(alpha = 0.3f)
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .menuAnchor()
                )
                ExposedDropdownMenu(
                    expanded = isDropdownExpanded,
                    onDismissRequest = { isDropdownExpanded = false },
                    modifier = Modifier.background(Color.White)
                ) {
                    dropdownItems.forEach { item ->
                        DropdownMenuItem(
                            text = { Text(item, style = MaterialTheme.typography.bodyLarge) },
                            onClick = {
                                onDropdownItemSelected(item)
                                onValueChange(item)
                                isDropdownExpanded = false
                            },
                            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp)
                        )
                    }
                }
            }
        } else {
            OutlinedTextField(
                value = value,
                onValueChange = { if (!readOnly && (maxLength == null || it.length <= maxLength)) onValueChange(it) },
                label = { Text(label, fontWeight = FontWeight.Medium) },
                isError = isError,
                leadingIcon = leadingIcon,
                trailingIcon = {
                    if (isError && trailingIcon == null) {
                        Icon(
                            imageVector = Icons.Default.Error,
                            contentDescription = "Error",
                            tint = MaterialTheme.colorScheme.error
                        )
                    } else {
                        trailingIcon?.invoke()
                    }
                },
                prefix = prefixText?.let { { Text(it, style = MaterialTheme.typography.bodyMedium) } },
                suffix = suffixText?.let { { Text(it, style = MaterialTheme.typography.bodyMedium) } },
                visualTransformation = visualTransformation,
                keyboardOptions = keyboardOptions,
                readOnly = readOnly,
                shape = fieldShape,
                colors = OutlinedTextFieldDefaults.colors(
                    unfocusedBorderColor = Color(0xFF0D47A1).copy(alpha = 0.6f),
                    focusedBorderColor = Color(0xFF0D47A1),
                    errorBorderColor = MaterialTheme.colorScheme.error,
                    focusedLabelColor = Color(0xFF0D47A1),
                    unfocusedLabelColor = Color(0xFF0D47A1).copy(alpha = 0.6f),
                    errorLabelColor = MaterialTheme.colorScheme.error,
                    cursorColor = Color(0xFF0D47A1),
                    focusedTextColor = Color.Black,
                    unfocusedTextColor = Color.Black,
                    disabledTextColor = Color.Black.copy(alpha = 0.6f),
                    disabledBorderColor = Color(0xFF0D47A1).copy(alpha = 0.3f),
                    disabledLabelColor = Color(0xFF0D47A1).copy(alpha = 0.3f)
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(fieldShape)
                    .shadow(2.dp, fieldShape)
                    .background(
                        if (readOnly) Color(0xFF0D47A1).copy(alpha = 0.1f)
                        else Color(0xFF4FC3F7).copy(alpha = 0.1f)
                    )
                    .scale(scale)
            )
        }

        // Helper Text
        AnimatedVisibility(
            visible = !helperText.isNullOrBlank(),
            enter = slideInVertically { it } + fadeIn(),
            exit = slideOutVertically { it } + fadeOut()
        ) {
            Text(
                text = helperText.orEmpty(),
                color = Color(0xFF0D47A1).copy(alpha = 0.6f),
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(start = 16.dp, top = 4.dp)
            )
        }

        // Error Message
        AnimatedVisibility(
            visible = isError && !errorMessage.isNullOrBlank(),
            enter = slideInVertically { it } + fadeIn(),
            exit = slideOutVertically { it } + fadeOut()
        ) {
            Text(
                text = errorMessage.orEmpty(),
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(start = 16.dp, top = 4.dp)
            )
        }

        // Character Counter
        if (maxLength != null) {
            Text(
                text = "${value.length}/$maxLength",
                color = if (isError) MaterialTheme.colorScheme.error else Color(0xFF0D47A1).copy(alpha = 0.6f),
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 16.dp, top = 4.dp, end = 16.dp)
            )
        }
    }
}

@PreviewLightDark
@Composable
fun CustomTextFieldStandardPreview() {
    Campus_payTheme {
        Surface(modifier = Modifier.padding(16.dp)) {
            var text by remember { mutableStateOf("") }
            CustomTextField(
                value = text,
                onValueChange = { text = it },
                label = "Username",
                helperText = "Enter your username",
                maxLength = 20
            )
        }
    }
}

@PreviewLightDark
@Composable
fun CustomTextFieldErrorPreview() {
    Campus_payTheme {
        Surface(modifier = Modifier.padding(16.dp)) {
            var text by remember { mutableStateOf("invalid-email") }
            CustomTextField(
                value = text,
                onValueChange = { text = it },
                label = "Email",
                isError = true,
                errorMessage = "Please enter a valid email address",
                helperText = "Use your college email"
            )
        }
    }
}

@PreviewLightDark
@Composable
fun CustomTextFieldPasswordPreview() {
    Campus_payTheme {
        Surface(modifier = Modifier.padding(16.dp)) {
            var password by remember { mutableStateOf("12345") }
            var isPasswordVisible by remember { mutableStateOf(false) }
            CustomTextField(
                value = password,
                onValueChange = { password = it },
                label = "Password",
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                visualTransformation = if (isPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                trailingIcon = {
                    val icon = if (isPasswordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility
                    val description = if (isPasswordVisible) "Hide password" else "Show password"
                    IconButton(onClick = { isPasswordVisible = !isPasswordVisible }) {
                        Icon(
                            imageVector = icon,
                            contentDescription = description,
                            tint = Color(0xFF0D47A1)
                        )
                    }
                },
                helperText = "Minimum 6 characters"
            )
        }
    }
}

@PreviewLightDark
@Composable
fun CustomTextFieldDropdownPreview() {
    Campus_payTheme {
        Surface(modifier = Modifier.padding(16.dp)) {
            var selected by remember { mutableStateOf("Student") }
            CustomTextField(
                value = selected,
                onValueChange = { selected = it },
                label = "Role",
                dropdownItems = listOf("Student", "Teacher", "Other"),
                onDropdownItemSelected = { selected = it },
                helperText = "Select your role"
            )
        }
    }
}

@PreviewLightDark
@Composable
fun CustomTextFieldReadOnlyPreview() {
    Campus_payTheme {
        Surface(modifier = Modifier.padding(16.dp)) {
            CustomTextField(
                value = "readonly@example.com",
                onValueChange = {},
                label = "Email",
                readOnly = true,
                helperText = "This field is read-only"
            )
        }
    }
}

@PreviewLightDark
@Composable
fun CustomTextFieldPrefixSuffixPreview() {
    Campus_payTheme {
        Surface(modifier = Modifier.padding(16.dp)) {
            var amount by remember { mutableStateOf("100") }
            CustomTextField(
                value = amount,
                onValueChange = { amount = it },
                label = "Amount",
                prefixText = "$",
                suffixText = "USD",
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                helperText = "Enter transaction amount",
                maxLength = 10
            )
        }
    }
}
