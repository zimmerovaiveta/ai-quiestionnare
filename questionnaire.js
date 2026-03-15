// Questionnaire Form Logic

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('questionnaireForm');
    const successMessage = document.getElementById('successMessage');
    const submitBtn = document.getElementById('submitBtn');

    // Conditional sections
    const satisfactionSection = document.getElementById('satisfactionSection');
    const workUsageSection = document.getElementById('workUsageSection');
    const useCasesSection = document.getElementById('useCasesSection');
    const taskComplexitySection = document.getElementById('taskComplexitySection');

    // Handle conditional field visibility
    const usesAIRadios = document.querySelectorAll('input[name="usesAI"]');
    usesAIRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateConditionalSections(this.value);
        });
    });

    function updateConditionalSections(usesAIValue) {
        // Show satisfaction question if uses AI for work
        if (usesAIValue === 'yes-work' || usesAIValue === 'yes-both') {
            satisfactionSection.style.display = 'block';
            makeFieldRequired('satisfaction', true);
        } else {
            satisfactionSection.style.display = 'none';
            makeFieldRequired('satisfaction', false);
            clearRadioSelection('satisfaction');
        }

        // Show work usage, use cases, and task complexity if uses AI at all
        if (usesAIValue !== 'no') {
            workUsageSection.style.display = 'block';
            useCasesSection.style.display = 'block';
            taskComplexitySection.style.display = 'block';
            makeFieldRequired('taskComplexity', true);
        } else {
            workUsageSection.style.display = 'none';
            useCasesSection.style.display = 'none';
            taskComplexitySection.style.display = 'none';
            clearCheckboxSelection('workUsage');
            clearCheckboxSelection('useCases');
            clearRadioSelection('taskComplexity');
            makeFieldRequired('taskComplexity', false);
        }
    }

    function makeFieldRequired(fieldName, required) {
        const radios = document.querySelectorAll(`input[name="${fieldName}"]`);
        radios.forEach(radio => {
            radio.required = required;
        });
    }

    function clearRadioSelection(fieldName) {
        const radios = document.querySelectorAll(`input[name="${fieldName}"]`);
        radios.forEach(radio => {
            radio.checked = false;
        });
    }

    function clearCheckboxSelection(fieldName) {
        const checkboxes = document.querySelectorAll(`input[name="${fieldName}"]`);
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
    }

    // Handle "None" checkbox exclusivity for tools
    const toolsCheckboxes = document.querySelectorAll('input[name="tools"]');
    toolsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.value === 'none' && this.checked) {
                toolsCheckboxes.forEach(cb => {
                    if (cb.value !== 'none') cb.checked = false;
                });
            } else if (this.checked && this.value !== 'none') {
                toolsCheckboxes.forEach(cb => {
                    if (cb.value === 'none') cb.checked = false;
                });
            }
        });
    });

    // Handle "I don't use AI for work" exclusivity for workUsage
    const workUsageCheckboxes = document.querySelectorAll('input[name="workUsage"]');
    workUsageCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.value === 'none' && this.checked) {
                workUsageCheckboxes.forEach(cb => {
                    if (cb.value !== 'none') cb.checked = false;
                });
            } else if (this.checked && this.value !== 'none') {
                workUsageCheckboxes.forEach(cb => {
                    if (cb.value === 'none') cb.checked = false;
                });
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            // Collect form data
            const formData = new FormData(form);
            const data = {
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                team: formData.get('team'),
                position: formData.get('position'),
                seniority: formData.get('seniority'),
                usesAI: formData.get('usesAI'),
                tools: formData.getAll('tools'),
                frequency: formData.get('frequency'),
                satisfaction: formData.get('satisfaction') || 'na',
                workUsage: formData.getAll('workUsage'),
                useCases: formData.getAll('useCases'),
                taskComplexity: formData.get('taskComplexity') || 'na'
            };

            // Validate required checkbox groups and conditional fields
            if (data.usesAI !== 'no') {
                if (data.workUsage.length === 0) {
                    alert('Please select at least one option for "How do you use AI for work?"');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Survey';
                    return;
                }
                if (data.useCases.length === 0) {
                    alert('Please select at least one option for "What do you use AI for?"');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Survey';
                    return;
                }
                if (!data.taskComplexity || data.taskComplexity === 'na') {
                    alert('Please select a task complexity level.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Survey';
                    return;
                }
            }

            if (data.tools.length === 0) {
                alert('Please select at least one AI tool (or "None")');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit Survey';
                return;
            }

            // Save to Firestore
            await db.collection('responses').add(data);

            // Show success message
            form.style.display = 'none';
            successMessage.style.display = 'block';

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });

        } catch (error) {
            console.error('Error saving response:', error);
            alert('Sorry, there was an error submitting your response. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Survey';
        }
    });
});
