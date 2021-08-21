import convertUnits from './convert-units.js';


function annotationScale({
  model_unit = 'mm',
  plot_unit = model_unit,
  plot_size = 1000,
  scale = 1,
}) {


  const size = convertUnits(plot_size, plot_unit, model_unit);
  const ref_size = 1000;
  const annotation_scale = size / (ref_size * scale);
  const model_scale = convertUnits(1, 'mm', model_unit);
  const dim_conversion = convertUnits(1, model_unit, plot_unit);

  return {
    annotation_scale,
    model_scale,
    dim_conversion,
  };
}

export default annotationScale;
