// Stub module for udcs_lwc_ui_service - provides action execution utilities

export const executeParallelActions = async (actions, context) => {
  // Stub implementation - sets up action_data structure
  context.action_data = [];
  
  for (let action of actions) {
    try {
      // Simulate action execution
      const result = await Promise.resolve({
        status: 'fulfilled',
        value: {}
      });
      context.action_data.push(result);
    } catch (error) {
      context.action_data.push({
        status: 'rejected',
        reason: error.message
      });
    }
  }
  
  return context.action_data;
};

export const executeParallelActionsNew = async (actions, context) => {
  // Same as executeParallelActions
  return executeParallelActions(actions, context);
};

export const executeAction = async (actions, context) => {
  // Same as executeParallelActions
  return executeParallelActions(actions, context);
};
