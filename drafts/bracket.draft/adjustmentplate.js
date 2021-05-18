function adjustmentplate(sketch, view = 'side', params) {
  return sketch.user[`adjustmentplate.${view}`](params);
}

