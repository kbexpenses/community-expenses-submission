import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import React from "react";
import { BaseField, filterDOMProps, nothing } from "uniforms";

const ErrorsField = (
  {
    children,
    fullWidth,
    margin,
    variant,
    ...props
  }: {
    children?: any;
    fullWidth?: any;
    margin?: any;

    variant?: "standard" | "outlined" | "filled";
  },
  { uniforms: { error, schema } }: { uniforms: { error: any; schema: any } }
) =>
  !error && !children ? (
    nothing
  ) : (
    <FormControl
      error={!!error}
      fullWidth={!!fullWidth}
      margin={margin}
      variant={variant}
    >
      {!!children && (
        <FormHelperText {...filterDOMProps(props)}>{children}</FormHelperText>
      )}
      {schema.getErrorMessages(error).map((message: string, index: number) => (
        <FormHelperText key={index} {...filterDOMProps(props)}>
          {message}
        </FormHelperText>
      ))}
    </FormControl>
  );
ErrorsField.contextTypes = BaseField.contextTypes;

ErrorsField.defaultProps = {
  fullWidth: true,
  margin: "dense"
};

export default ErrorsField;
